# SAR TREE INDUSTRIES - E-commerce Platform

This is a modern, responsive e-commerce platform for SAR TREE INDUSTRIES, built with React, TypeScript, and Vite.

## ✨ Features

- **Product Catalog:** Browse a wide range of products with detailed descriptions and images.
- **Shopping Cart:** Add products to your cart and manage your selections.
- **User Authentication:** Secure user registration and login with JWT-based authentication.
- **Responsive Design:** A seamless experience across all devices, from mobile to desktop.
- **Modern Tech Stack:** Built with the latest technologies for a fast and reliable experience.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (or your preferred package manager like `yarn` or `pnpm`)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/sartree-ecommerce.git
    cd sartree-ecommerce
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:5173`.

## 🛠️ Tech Stack

- **Frontend:**
  - [React](https://reactjs.org/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Vite](https://vitejs.dev/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Shadcn/ui](https://ui.shadcn.com/) for UI components
- **State Management:** React Context API
- **Routing:** [React Router](https://reactrouter.com/)
- **API Communication:** [Axios](https://axios-http.com/)

## 📝 API Endpoints

The application communicates with a backend API for data and authentication. The base URL for the API is `https://api.sartree.com/api/v1`.

### Key Endpoints:

-   `POST /client/token`: Fetches client credentials required for the application.
-   `POST /user/login`: Authenticates a user and returns a JWT.
-   `POST /user/register`: Creates a new user account.
-   `GET /products`: Retrieves a list of all products.
-   `GET /products/{id}`: Fetches details for a specific product.

## 📂 Project Structure

```
/
├── public/           # Static assets
├── src/
│   ├── assets/       # Images, fonts, etc.
│   ├── components/   # Reusable UI components
│   ├── contexts/     # React context for state management
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions
│   ├── pages/        # Application pages
│   ├── services/     # API interaction layer
│   └── ...
├── tailwind.config.ts # Tailwind CSS configuration
└── vite.config.ts    # Vite configuration
```

## 🤝 Contributing

Contributions are welcome! If you have suggestions or find any issues, please open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
