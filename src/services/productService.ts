interface IProduct {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  additionalImages?: string[];
  category: string;
  stockQuantity: number;
  isAvailable: boolean;
  isActive: boolean;
  sortOrder: number;
  razorpayProductId?: string;
  createdAt: string;
}

export class ProductService {
  private static readonly API_BASE_URL = import.meta.env.VITE_API_URL
  || 'https://api.pncpriyamnutritioncare.com/api'
  // || 'http://localhost:5003/api'
  ;

  static async getAllProducts(token?: string): Promise<IProduct[]> {
    try {
      // Use admin endpoint only if we have a valid token
      const url = (token && token.trim() !== '') ? `${this.API_BASE_URL}/products/admin` : `${this.API_BASE_URL}/products`;
      const headers: Record<string, string> = {};

      if (token && token.trim() !== '') {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const products = await response.json();
      return products.sort((a: IProduct, b: IProduct) => (a.sortOrder || 0) - (b.sortOrder || 0));
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw new Error('Failed to fetch products');
    }
  }

  static async getProductById(id: string): Promise<IProduct> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/products/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch product:', error);
      throw new Error('Failed to fetch product');
    }
  }

  static async createProduct(productData: Partial<IProduct>, token: string): Promise<IProduct> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const error = await response.json();
        // Handle authentication errors
        if (response.status === 401) {
          // Clear invalid token
          localStorage.removeItem('token');
          window.location.href = '/admin/auth';
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create product:', error);
      throw new Error(error.message || 'Failed to create product');
    }
  }

  static async updateProduct(id: string, updates: Partial<IProduct>, token: string): Promise<IProduct> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/admin/auth';
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update product:', error);
      throw new Error(error.message || 'Failed to update product');
    }
  }

  static async deleteProduct(id: string, token: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/admin/auth';
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw new Error(error.message || 'Failed to delete product');
    }
  }

  static async toggleActive(id: string, token: string): Promise<IProduct> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/products/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/admin/auth';
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to toggle product active status:', error);
      throw new Error(error.message || 'Failed to toggle product active status');
    }
  }

  static async toggleAvailability(id: string, token: string): Promise<IProduct> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/products/${id}/toggle-availability`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/admin/auth';
          throw new Error(error.error || `HTTP error! status: ${response.status}`);
        }
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to toggle product availability:', error);
      throw new Error(error.message || 'Failed to toggle product availability');
    }
  }
}
