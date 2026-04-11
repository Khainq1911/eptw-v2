import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VNPay, HashAlgorithm, ProductCode, VnpLocale, ReturnQueryFromVNPay } from 'vnpay';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class VnpayService implements OnModuleInit {
  private vnpay: VNPay;
  private readonly logger = new Logger(VnpayService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.vnpay = new VNPay({
      tmnCode: this.configService.get<string>('VNP_TMN_CODE')!,
      secureSecret: this.configService.get<string>('VNP_HASH_SECRET')!,
      vnpayHost: 'https://sandbox.vnpayment.vn',
      testMode: true,
      hashAlgorithm: HashAlgorithm.SHA512,
      enableLog: true,
    });

    this.logger.log('VNPay initialized successfully');
  }

  /**
   * Tạo URL thanh toán VNPay
   */
  async createPaymentUrl(
    dto: CreatePaymentDto,
    ipAddr: string,
  ): Promise<{ paymentUrl: string; txnRef: string }> {
    const txnRef = this.generateTxnRef();

    const paymentUrl = this.vnpay.buildPaymentUrl({
      vnp_Amount: dto.amount,
      vnp_IpAddr: ipAddr,
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: dto.orderInfo,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: this.configService.get<string>('VNP_RETURN_URL')!,
      vnp_Locale: (dto.locale as VnpLocale) || VnpLocale.VN,
    });

    this.logger.log(`Payment URL created for txnRef: ${txnRef}`);

    return { paymentUrl, txnRef };
  }

  /**
   * Xác thực kết quả thanh toán từ VNPay Return URL
   */
  handleReturn(query: Record<string, string>): {
    isSuccess: boolean;
    message: string;
    data?: Record<string, string>;
  } {
    try {
      const verify = this.vnpay.verifyReturnUrl(query as unknown as ReturnQueryFromVNPay);

      if (!verify.isVerified) {
        this.logger.warn(`Invalid signature for txnRef: ${query.vnp_TxnRef}`);
        return { isSuccess: false, message: 'Chữ ký không hợp lệ' };
      }

      if (verify.isSuccess) {
        this.logger.log(`Payment SUCCESS: ${query.vnp_TxnRef}`);
        return {
          isSuccess: true,
          message: 'Thanh toán thành công',
          data: {
            txnRef: query.vnp_TxnRef,
            amount: String(Number(query.vnp_Amount) / 100),
            bankCode: query.vnp_BankCode,
            bankTranNo: query.vnp_BankTranNo,
            cardType: query.vnp_CardType,
            transactionNo: query.vnp_TransactionNo,
            payDate: query.vnp_PayDate,
            responseCode: query.vnp_ResponseCode,
          },
        };
      } else {
        this.logger.warn(`Payment FAILED: ${query.vnp_TxnRef} - Code: ${query.vnp_ResponseCode}`);
        return {
          isSuccess: false,
          message: `Thanh toán thất bại. Mã lỗi: ${query.vnp_ResponseCode}`,
        };
      }
    } catch (error) {
      this.logger.error('Error verifying return URL', error);
      return { isSuccess: false, message: 'Lỗi xử lý kết quả thanh toán' };
    }
  }

  /**
   * Xử lý VNPay IPN (Instant Payment Notification)
   */
  handleIpn(query: Record<string, string>): {
    RspCode: string;
    Message: string;
  } {
    try {
      const verify = this.vnpay.verifyIpnCall(query as unknown as ReturnQueryFromVNPay);

      if (!verify.isVerified) {
        return { RspCode: '97', Message: 'Invalid Checksum' };
      }

      if (verify.isSuccess) {
        this.logger.log(`IPN SUCCESS: ${query.vnp_TxnRef}`);
        return { RspCode: '00', Message: 'Confirm Success' };
      } else {
        this.logger.warn(`IPN FAILED: ${query.vnp_TxnRef}`);
        return { RspCode: '00', Message: 'Confirm Success' };
      }
    } catch (error) {
      this.logger.error('Error processing IPN', error);
      return { RspCode: '99', Message: 'Unknown error' };
    }
  }

  /**
   * Tạo mã giao dịch duy nhất
   */
  private generateTxnRef(): string {
    const now = new Date();
    const dateStr = now
      .toISOString()
      .replace(/[-T:.Z]/g, '')
      .slice(0, 14);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TXN${dateStr}${random}`;
  }
}
