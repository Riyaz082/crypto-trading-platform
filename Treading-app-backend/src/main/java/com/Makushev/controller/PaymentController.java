package com.Makushev.controller;

import com.Makushev.domain.PaymentMethod;
import com.Makushev.model.PaymentOrder;
import com.Makushev.model.User;
import com.Makushev.response.PaymentResponse;
import com.Makushev.service.PaymentService;
import com.Makushev.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class PaymentController {

    private UserService userService;

    private PaymentService paymentService;

    @Autowired
    public PaymentController(UserService userService, PaymentService paymentService) {
        this.userService = userService;
        this.paymentService = paymentService;
    }

    @PostMapping("/api/payment/{paymentMethod}/amount/{amount}")
    public ResponseEntity<PaymentResponse> paymentHandler(
            @PathVariable PaymentMethod paymentMethod,
            @PathVariable Long amount,
            @RequestHeader("Authorization") String jwt) throws
            Exception{

        User user = userService.findUserProfileByJwt(jwt);

        if (amount == null || amount <= 0) {
            throw new Exception("Payment amount must be greater than zero");
        }

        PaymentResponse paymentResponse;

        PaymentOrder order = paymentService.createOrder(user, amount, paymentMethod);

        if(paymentMethod == PaymentMethod.RAZORPAY){
            paymentResponse = paymentService.createRazorpayPaymentLink(user, amount, order.getId());
        }
        else {
            paymentResponse = paymentService.createStripePaymentLink(user, amount, order.getId());
        }

        return new ResponseEntity<>(paymentResponse, HttpStatus.CREATED);
    }

    @GetMapping(value = "/api/payment/demo-gateway", produces = "text/html")
    @ResponseBody
    public String showDemoGateway(
            @RequestParam("order_id") Long orderId,
            @RequestParam("amount") Long amount,
            @RequestParam("payment_method") String paymentMethod,
            jakarta.servlet.http.HttpServletRequest request) {

        String referer = request.getHeader("Referer");
        String origin = request.getHeader("Origin");
        String redirectBase = "http://localhost:8082";
        if (origin != null && !origin.isEmpty()) {
            redirectBase = origin;
        } else if (referer != null && !referer.isEmpty()) {
            try {
                java.net.URI uri = new java.net.URI(referer);
                redirectBase = uri.getScheme() + "://" + uri.getAuthority();
            } catch (Exception ignored) {}
        } else {
            String host = request.getHeader("Host");
            if (host != null) {
                String domain = host.split(":")[0];
                redirectBase = "http://" + domain + ":8082";
            }
        }

        String randomTxId = "pay_mock_" + java.util.UUID.randomUUID().toString().replace("-", "").substring(0, 16);

        return "<html>" +
                "<head>" +
                "  <title>Antigravity Mock Payment Gateway</title>" +
                "  <meta name='viewport' content='width=device-width, initial-scale=1'>" +
                "  <style>" +
                "    body { font-family: 'Outfit', -apple-system, sans-serif; background-color: #0d1117; color: #c9d1d9; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }" +
                "    .card { background-color: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 32px; width: 100%; max-width: 400px; box-shadow: 0 8px 24px rgba(0,0,0,0.5); text-align: center; }" +
                "    h2 { color: #58a6ff; margin-bottom: 24px; font-weight: 600; }" +
                "    .details { text-align: left; background: #0d1117; padding: 16px; border-radius: 8px; border: 1px solid #21262d; margin-bottom: 24px; font-size: 14px; }" +
                "    .row { display: flex; justify-content: space-between; margin-bottom: 8px; }" +
                "    .row:last-child { margin-bottom: 0; }" +
                "    .label { color: #8b949e; }" +
                "    .value { font-weight: bold; color: #f0f6fc; }" +
                "    .btn { display: block; width: 100%; padding: 12px; border-radius: 6px; border: none; font-size: 16px; font-weight: bold; cursor: pointer; text-decoration: none; margin-bottom: 12px; text-align: center; transition: all 0.2s ease; }" +
                "    .btn-success { background-color: #2ea44f; color: white; }" +
                "    .btn-success:hover { background-color: #2c974b; }" +
                "    .btn-failure { background-color: #da3637; color: white; margin-bottom: 0; }" +
                "    .btn-failure:hover { background-color: #b92b2c; }" +
                "  </style>" +
                "</head>" +
                "<body>" +
                "  <div class='card'>" +
                "    <h2>Mock Payment Gateway</h2>" +
                "    <div class='details'>" +
                "      <div class='row'><span class='label'>Order ID:</span><span class='value'>" + orderId + "</span></div>" +
                "      <div class='row'><span class='label'>Amount:</span><span class='value'>$" + amount + "</span></div>" +
                "      <div class='row'><span class='label'>Method:</span><span class='value'>" + paymentMethod + "</span></div>" +
                "    </div>" +
                "    <a href='" + redirectBase + "/wallet?order_id=" + orderId + "&payment_id=" + randomTxId + "' class='btn btn-success'>Simulate Success</a>" +
                "    <a href='" + redirectBase + "/wallet?order_id=" + orderId + "&payment_id=pay_mock_fail' class='btn btn-failure'>Simulate Failure</a>" +
                "  </div>" +
                "</body>" +
                "</html>";
    }
}
