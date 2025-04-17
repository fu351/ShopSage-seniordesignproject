openapi: 3.0.0
info:
  title: ShopSage API
  description: API documentation for the ShopSage project.
  version: 1.0.0
servers:
  - url: http://localhost:5000
    description: Local development server
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
security:
  - BearerAuth: []
paths:
  /api/kroger:
    get:
      summary: Fetch products from Kroger
      description: Retrieve a list of products from Kroger based on zip code, search term, and optional brand.
      parameters:
        - name: zipCode
          in: query
          required: true
          schema:
            type: integer
          description: The zip code to search for products.
        - name: searchTerm
          in: query
          required: true
          schema:
            type: string
          description: The term to search for products.
        - name: brand
          in: query
          required: false
          schema:
            type: string
          description: The brand to filter products by.
      responses:
        '200':
          description: A list of products from Kroger
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id:
                      type: string
                      example: "0001111018188"
                    name:
                      type: string
                      example: "Fuji Apples"
                    price:
                      type: number
                      format: float
                      example: 3.99
                    image_url:
                      type: string
                      example: "https://example.com/image.jpg"
                    location:
                      type: string
                      example: "Kroger Store #123"
        '500':
          description: Failed to fetch products from Kroger API
  /api/samsclub:
    get:
      summary: Fetch products from Sam's Club
      description: Retrieve a list of products from Sam's Club based on zip code and search term.
      parameters:
        - name: zipCode
          in: query
          required: true
          schema:
            type: integer
          description: The zip code to search for products.
        - name: searchTerm
          in: query
          required: true
          schema:
            type: string
          description: The term to search for products.
      responses:
        '200':
          description: A list of products from Sam's Club
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id:
                      type: string
                      example: "123456789"
                    name:
                      type: string
                      example: "Organic Bananas"
                    price:
                      type: number
                      format: float
                      example: 1.99
                    image_url:
                      type: string
                      example: "https://example.com/image.jpg"
                    location:
                      type: string
                      example: "Sam's Club #456"
        '500':
          description: Failed to fetch products from Sam's Club API
  /register:
    post:
      summary: Register a new user
      description: Create a new user account with a username and password.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                username:
                  type: string
                  example: "john_doe"
                password:
                  type: string
                  example: "password123"
      responses:
        '200':
          description: User registered successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "User registered successfully"
        '400':
          description: Username already exists
        '500':
          description: Could not register user
  /login:
    post:
      summary: Log in a user
      description: Authenticate a user and return a JWT token.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                username:
                  type: string
                  example: "john_doe"
                password:
                  type: string
                  example: "password123"
      responses:
        '200':
          description: User logged in successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  token:
                    type: string
                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        '401':
          description: Invalid credentials
        '500':
          description: Could not log in