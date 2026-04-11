import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { VnpayService } from './vnpay.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Public } from '@/common/decorators/auth.decorator';
import { Request } from 'express';

@Public()
@Controller('vnpay')
export class VnpayController {
  constructor(private readonly vnpayService: VnpayService) {}

  /**
   * Tạo URL thanh toán VNPay
   * POST /vnpay/create-payment
   */
  @Post('create-payment')
  async createPayment(
    @Body() dto: CreatePaymentDto,
    @Req() req: Request,
  ) {
    const ipAddr =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    return this.vnpayService.createPaymentUrl(dto, ipAddr);
  }

  /**
   * VNPay Return URL - Xác thực kết quả thanh toán
   * GET /vnpay/vnpay-return
   */
  @Get('vnpay-return')
  vnpayReturn(@Query() query: Record<string, string>) {
    return this.vnpayService.handleReturn(query);
  }

  /**
   * VNPay IPN URL - Server-to-server notification
   * GET /vnpay/vnpay-ipn
   */
  @Get('vnpay-ipn')
  vnpayIpn(@Query() query: Record<string, string>) {
    return this.vnpayService.handleIpn(query);
  }
}
