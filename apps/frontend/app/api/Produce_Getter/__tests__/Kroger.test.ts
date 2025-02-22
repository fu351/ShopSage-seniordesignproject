import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { Krogers } from "../Kroger"; // Adjust import path as needed

const mock = new MockAdapter(axios);

describe("Kroger API - Unit Test", () => {
  afterEach(() => {
    mock.reset(); // Reset mock state after each test
  });

  test("should return product data on success", async () => {
    const mockAuthToken = "mockAuthToken";
    const mockLocationId = "mockLocationId";
    const mockResponse = {
      data: [
        {
          productId: '0001111018188',
          upc: '0001111018188',
          productPageURI: '/p/fuji-apples-3-pound-bag/0001111018188?cid=dis.api.tpi_products-api_20240521_b:all_c:p_t:shopsage-24326124303',
          aisleLocations: [],
          categories: [ 'Produce', 'Produce' ],
          countryOrigin: 'UNITED STATES',
          description: 'Fuji Apples - 3 Pound Bag',
          images: [ { url: 'https://example.com/image.jpg' } ],
          items: [ { price: 3.99, inventory: { stockLevel: "IN_STOCK" } } ], // Ensure stockLevel is present
          itemInformation: { depth: '3.0', height: '4.0', width: '3.0' },
          temperature: { indicator: 'Ambient', heatSensitive: false }
        }
      ]
    };

    // Mock the auth token request
    mock.onPost("https://api.kroger.com/v1/connect/oauth2/token").reply(200, { access_token: mockAuthToken });
    // Mock the location ID request
    mock.onGet(/kroger\.com\/v1\/locations/).reply(200, { data: [{ locationId: mockLocationId }] });
    // Mock the products request
    mock.onGet(/kroger\.com\/v1\/products/).reply(200, mockResponse);

    const result = await Krogers(47906, "apples"); // Test function
    expect(result).toEqual(mockResponse.data);
  });

  test("should handle API errors", async () => {
    // Mock the auth token request to fail
    mock.onPost("https://api.kroger.com/v1/connect/oauth2/token").reply(500);

    await expect(Krogers(47906, "apples")).rejects.toThrow("Error fetching auth token:");
  });
});
