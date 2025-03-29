import requests
import argparse
import json
from typing import Dict, Optional
import sys
import uuid
import os

class CLIHttpClient:
    def __init__(self):
        self.session = requests.Session()
        
    def send_request(
        self,
        method: str,
        url: str,
        headers: Optional[Dict] = None,
        params: Optional[Dict] = None,
        data: Optional[Dict] = None,
        json_data: Optional[Dict] = None
    ) -> requests.Response:
        """Send HTTP request and return the response"""
        try:
            response = self.session.request(
                method=method.upper(),
                url=url,
                headers=headers,
                params=params,
                data=data,
                json=json_data
            )
            return response
        except requests.exceptions.RequestException as e:
            print(f"Error: {e}")
            raise e  # Re-raise the exception instead of returning None

    def format_response(self, response: requests.Response, requested_url: str) -> None:
        """Format and print the response, including the requested URL."""
        print("\n=== Request URL ===")
        print(requested_url)  # Print the requested URL

        print("\n=== Response ===")
        print(f"Status Code: {response.status_code}")
        print("\n=== Headers ===")
        for key, value in response.headers.items():
            print(f"{key}: {value}")
        
        print("\n=== Body ===")
        try:
            # Try to parse and pretty print JSON response
            response_json = response.json()
            response_text = json.dumps(response_json, indent=2)
        except json.JSONDecodeError:
            # If not JSON, use raw text
            response_text = response.text

        if len(response_text) > 100:
            # Generate a unique filename
            filename = f"response_{uuid.uuid4()}.txt"
            # Save to file
            with open(filename, "w") as f:
                f.write(response_text)
            print(response_text[:100] + "..." + f" [Output too long. Saved to {filename}]")

        else:
            print(response_text)

def parse_key_value_arg(arg: str) -> Dict:
    """Parse key-value pairs from command line arguments"""
    if not arg:
        return {}
    try:
        return dict(item.split("=") for item in arg.split(","))
    except ValueError:
        print(f"Error: Invalid format for key-value pairs: {arg}")
        print("Expected format: key1=value1,key2=value2")
        return {}  # Return empty dict instead of exiting

def interactive_mode(client: CLIHttpClient):
    """Interactive mode for the CLI HTTP client"""
    print("Entering interactive mode. Type 'exit' to quit.")
    while True:
        try:
            method = input("Method (GET, POST, PUT, DELETE, PATCH): ").upper()
            if method.lower() == 'exit':
                break
            if method not in ["GET", "POST", "PUT", "DELETE", "PATCH"]:
                print("Invalid method.")
                continue

            url = input("URL: ")
            if url.lower() == 'exit':
                break

            # Construct the full URL with parameters for display
            # This is important for showing the user the *actual* URL being requested
            full_url = url
            params_input = input("Params (key1=value1,key2=value2, or leave empty): ")
            if params_input.lower() == 'exit':
                break
            params = parse_key_value_arg(params_input)
            if params:  # Only add if params exist
                full_url = requests.Request('GET', url, params=params).prepare().url

            headers_input = input("Headers (key1=value1,key2=value2, or leave empty): ")
            if headers_input.lower() == 'exit':
                break
            headers = parse_key_value_arg(headers_input)

            data_input = input("Data (key1=value1,key2=value2, or leave empty): ")
            if data_input.lower() == 'exit':
                break
            data = parse_key_value_arg(data_input)

            json_input = input("JSON (key1=value1,key2=value2, or leave empty): ")
            if json_input.lower() == 'exit':
                break
            json_data = parse_key_value_arg(json_input)

            response = client.send_request(method, url, headers, params, data, json_data)
            if response:  # Check if response is not None
                client.format_response(response, str(full_url))  # Pass full_url as str

        except KeyboardInterrupt:
            print("\nExiting interactive mode.")
            break
        except EOFError:
            print("\nExiting interactive mode.")
            break

def main():
    parser = argparse.ArgumentParser(description="CLI HTTP Client")
    parser.add_argument("--interactive", action="store_true", help="Enable interactive mode")
    # Keep the other arguments for non-interactive use
    parser.add_argument("method", nargs='?', choices=["get", "post", "put", "delete", "patch"],
                        help="HTTP method")
    parser.add_argument("url", nargs='?', help="Request URL")
    parser.add_argument("--headers", help="Request headers (key1=value1,key2=value2)")
    parser.add_argument("--params", help="Query parameters (key1=value1,key2=value2)")
    parser.add_argument("--data", help="Form data (key1=value1,key2=value2)")
    parser.add_argument("--json", help="JSON data (key1=value1,key2=value2)")

    args = parser.parse_args()

    client = CLIHttpClient()

    if args.interactive:
        interactive_mode(client)
    elif args.method and args.url:  # Check if positional args are provided
        # Parse arguments
        headers = parse_key_value_arg(args.headers)
        params = parse_key_value_arg(args.params)
        data = parse_key_value_arg(args.data)
        json_data = parse_key_value_arg(args.json)

        # Construct full URL here as well, for consistency
        full_url = args.url
        if params:
            full_url = requests.Request('GET', args.url, params=params).prepare().url

        response = client.send_request(
            method=args.method,
            url=args.url,  # Use the original URL for the request
            headers=headers,
            params=params,
            data=data,
            json_data=json_data
        )
        if response:
            client.format_response(response, str(full_url))  # Pass full_url
    else:
        print("Error: You must either use --interactive mode or provide method and URL.")
        parser.print_help()

if __name__ == "__main__":
    main()
