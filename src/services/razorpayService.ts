// Razorpay service for payment integration
interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description?: string;
    image?: string;
    order_id?: string;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    notes?: Record<string, string>;
    theme?: {
      color?: string;
    };
    handler?: (response: RazorpayResponse) => void;
  }
  
  interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }
  
  declare global {
    interface Window {
      Razorpay: new (options: RazorpayOptions) => {
        open: () => void;
      };
    }
  }
  
  export class RazorpayService {
    private static readonly RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_here';
    private static readonly API_BASE_URL = (() => {
      let baseUrl = import.meta.env.VITE_API_URL;
      if (!baseUrl) {
        baseUrl = 'https://api.pncpriyamnutritioncare.com/api';
      }
      // Ensure the URL ends with /api
      if (!baseUrl.endsWith('/api')) {
        baseUrl += '/api';
      }
      return baseUrl;
    })();
  
    static async createOrder(amount: number, currency: string = 'INR'): Promise<{ orderId: string }> {
      try {
        const response = await fetch(`${this.API_BASE_URL}/payments/create-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amount * 100, // Convert to paisa
            currency,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        return { orderId: data.orderId };
      } catch (error) {
        console.error('Failed to create Razorpay order:', error);
        throw new Error('Failed to create payment order');
      }
    }
  
    static async initiatePayment(
      amount: number,
      productName: string,
      customerDetails?: {
        name?: string;
        email?: string;
        contact?: string;
      },
      onSuccess?: (response: RazorpayResponse) => void,
      onFailure?: (error: any) => void
    ): Promise<void> {
      try {
        // Create order first
        const { orderId } = await this.createOrder(amount);
  
        const options: RazorpayOptions = {
          key: this.RAZORPAY_KEY,
          amount: amount * 100, // Convert to paisa
          currency: 'INR',
          name: 'PNC Nutrition Care',
          description: `Payment for ${productName}`,
          image: '/pnc-logo.svg',
          order_id: orderId,
          prefill: customerDetails,
          notes: {
            product: productName,
          },
          theme: {
            color: '#10b981', // Primary green color
          },
          handler: (response) => {
            console.log('Payment successful:', response);
            if (onSuccess) {
              onSuccess(response);
            }
          },
        };
  
        // Check if Razorpay script is loaded
        if (!window.Razorpay) {
          // Load Razorpay script dynamically
          await this.loadRazorpayScript();
        }
  
        const razorpayInstance = new window.Razorpay(options);
  
        razorpayInstance.open();
  
      } catch (error) {
        console.error('Failed to initiate payment:', error);
        if (onFailure) {
          onFailure(error);
        }
      }
    }
  
    private static loadRazorpayScript(): Promise<void> {
      return new Promise((resolve, reject) => {
        if (window.Razorpay) {
          resolve();
          return;
        }
  
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Razorpay script'));
        document.head.appendChild(script);
      });
    }
  
    static async verifyPayment(
      paymentId: string,
      orderId: string,
      signature: string
    ): Promise<{ success: boolean; message: string }> {
      try {
        const response = await fetch(`${this.API_BASE_URL}/payments/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            razorpay_payment_id: paymentId,
            razorpay_order_id: orderId,
            razorpay_signature: signature,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('Failed to verify payment:', error);
        return { success: false, message: 'Payment verification failed' };
      }
    }
  }