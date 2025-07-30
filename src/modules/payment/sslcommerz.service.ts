export const initiateSSLCommerzPayment = async (
  bookingId: string,
  amount: number
) => {
  const postData = {
    store_id: "okobi68554e15af27f",
    store_passwd: "okobi68554e15af27f@ssl",
    total_amount: amount,
    currency: "BDT",
    tran_id: bookingId,
    success_url: `${process.env.SERVER_BASE_URL}/payment/success?tran_id=${bookingId}`,
    fail_url: `${process.env.SERVER_BASE_URL}/payment/fail?tran_id=${bookingId}`,
    cancel_url: `${process.env.SERVER_BASE_URL}/payment/cancel?tran_id=${bookingId}`,
    ipn_url: `${process.env.SERVER_BASE_URL}/payment/ipn?tran_id=${bookingId}`,
    cus_name: "Test User",
    cus_email: "test@example.com",
    cus_add1: "Dhaka",
    cus_add2: "",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1207",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "",
    multi_card_name: "",
    shipping_method: "NO",
    product_name: "Rent Booking",
    product_category: "Property",
    product_profile: "general",
  };

  const formData = new URLSearchParams(postData as any).toString();

  try {
    const response = await fetch(
      "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      }
    );

    const data = await response.json();
    // console.log("SSLCommerz response:", data);

    if (data && data.GatewayPageURL) {
      return data.GatewayPageURL;
    } else {
      throw new Error(data.failedreason || "No GatewayPageURL returned");
    }
  } catch (error: any) {
    console.error("SSLCommerz error:", error.message || error);
    return "";
  }
};
