/**
 * A TypeScript wrapper for making requests through a CORS proxy
 * @param url The URL to fetch
 * @param options Fetch options
 * @returns Promise with the fetch response
 */
export const fetchWithCorsProxy = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const corsProxyUrl = "http://localhost:8080/"; // CORS Anywhere proxy URL

  const response = await fetch(`${corsProxyUrl}${url}`, options);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json() as Promise<T>;
};
