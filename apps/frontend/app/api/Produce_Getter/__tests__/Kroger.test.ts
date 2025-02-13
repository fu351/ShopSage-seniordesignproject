import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { Krogers } from "../Kroger"; // Adjust import path as needed

const mock = new MockAdapter(axios);

describe("Kroger API - Unit Test", () => {
  afterEach(() => {
    mock.reset(); // Reset mock state after each test
  });

  test("should return product data on success", async () => {
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
          images: [ [Object] ],
          items: [ [Object] ],
          itemInformation: {},
          temperature: { indicator: 'Ambient', heatSensitive: false }
        },
        {
          productId: '0001111091825',
          upc: '0001111091825',
          productPageURI: '/p/kroger-gala-apples-3-pound-bag/0001111091825?cid=dis.api.tpi_products-api_20240521_b:all_c:p_t:shopsage-24326124303',
          aisleLocations: [ [Object] ],
          categories: [ 'Produce', 'Produce' ],
          countryOrigin: 'UNITED STATES',
          description: 'Kroger® Gala Apples – 3 Pound Bag',
          images: [ [Object], [Object], [Object], [Object] ],
          items: [ [Object] ],
          itemInformation: { depth: '5.0', height: '10.0', width: '12.0' },
          temperature: { indicator: 'Ambient', heatSensitive: false }
        },
        {
          productId: '0000000004134',
          upc: '0000000004134',
          productPageURI: '/p/large-gala-apple-each/0000000004134?cid=dis.api.tpi_products-api_20240521_b:all_c:p_t:shopsage-24326124303',
          aisleLocations: [ [Object] ],
          brand: 'Fresh Apples',
          categories: [ 'Produce', 'Produce' ],
          countryOrigin: 'ARGENTINA; CANADA; CHILE; NEW ZEALAND; UNITED STATES',
          description: 'Large Gala Apple - Each',
          images: [ [Object], [Object] ],
          items: [ [Object] ],
          itemInformation: { depth: '3.0', height: '4.0', width: '3.0' },
          temperature: { indicator: 'Ambient', heatSensitive: false }
        },
        {
          productId: '0000000003507',
          upc: '0000000003507',
          productPageURI: '/p/large-cosmic-crisp-apple-each/0000000003507?cid=dis.api.tpi_products-api_20240521_b:all_c:p_t:shopsage-24326124303',
          aisleLocations: [ [Object] ],
          brand: 'Fresh Apples',
          categories: [ 'Produce' ],
          countryOrigin: 'UNITED STATES',
          description: 'Large Cosmic Crisp Apple - Each',
          images: [ [Object], [Object], [Object] ],
          items: [ [Object] ],
          itemInformation: { depth: '3.0', height: '2.5', width: '3.0' },
          temperature: { indicator: 'Ambient', heatSensitive: false }
        },
        {
          productId: '0000000003283',
          upc: '0000000003283',
          productPageURI: '/p/large-honeycrisp-apple-each/0000000003283?cid=dis.api.tpi_products-api_20240521_b:all_c:p_t:shopsage-24326124303',
          aisleLocations: [ [Object] ],
          brand: 'Fresh Apples',
          categories: [ 'Produce', 'Produce' ],
          countryOrigin: 'ARGENTINA; CANADA; CHILE; UNITED STATES',
          description: 'Large Honeycrisp Apple - Each',
          images: [ [Object], [Object], [Object], [Object] ],
          items: [ [Object] ],
          itemInformation: { depth: '3.0', height: '4.0', width: '3.0' },
          temperature: { indicator: 'Ambient', heatSensitive: false }
        },
        {
          productId: '0000000004130',
          upc: '0000000004130',
          productPageURI: '/p/large-pink-lady-apple-each/0000000004130?cid=dis.api.tpi_products-api_20240521_b:all_c:p_t:shopsage-24326124303',
          aisleLocations: [ [Object] ],
          brand: 'Fresh Apples',
          categories: [ 'Produce' ],
          countryOrigin: 'CANADA; NEW ZEALAND; UNITED STATES',
          description: 'Large Pink Lady Apple - Each',
          images: [ [Object], [Object], [Object] ],
          items: [ [Object] ],
          itemInformation: { depth: '4.0', height: '4.5', width: '4.0' },
          temperature: { indicator: 'Ambient', heatSensitive: false }
        },
        {
          productId: '0000000004131',
          upc: '0000000004131',
          productPageURI: '/p/large-fuji-apple-each/0000000004131?cid=dis.api.tpi_products-api_20240521_b:all_c:p_t:shopsage-24326124303',
          aisleLocations: [ [Object] ],
          brand: 'Fresh Apples',
          categories: [ 'Produce', 'Produce' ],
          countryOrigin: 'ARGENTINA; CANADA; CHILE; NEW ZEALAND; UNITED STATES',
          description: 'Large Fuji Apple - Each',
          images: [ [Object], [Object], [Object], [Object] ],
          items: [ [Object] ],
          itemInformation: { depth: '3.15', height: '3.25', width: '3.25' },
          temperature: { indicator: 'Ambient', heatSensitive: false }
        }
      ]
    };

    mock.onGet(/kroger\.com\/v1\/products/).reply(200, mockResponse);

    const result = await Krogers(47906, "apples"); // Test function
    expect(result).toEqual(mockResponse.data);
  });

  test("should handle API errors", async () => {
    mock.onGet(/kroger\.com\/v1\/products/).reply(500);

    await expect(Krogers(47906, "apples")).rejects.toThrow("Request failed");
  });
});
