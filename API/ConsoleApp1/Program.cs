using System;
using System.IO;
using System.Net;
using System.Text;

namespace ConsoleApp1
{
    internal class Program
    {
        /// <summary>
        /// Basic C# HTTP server that listens for incoming requests on localhost:2025.
        /// I assume that you understand the basic of C#, So i don't need to explain in detail.
        /// also read the documentation/README
        /// </summary>
        static void Main(string[] args)
        {
            HttpListener web = new HttpListener();
            web.AuthenticationSchemes = AuthenticationSchemes.Anonymous;

            web.Prefixes.Add("http://localhost:2025/data/");
            web.Prefixes.Add("http://localhost:2025/attach/");
            web.Prefixes.Add("http://localhost:2025/stop/");

            web.Start();
            Console.WriteLine("STARTED ON LOCALHOST:2025 | ENDPOINTS: /data, /attach, /stop");

            while (true)
            {
                HttpListenerContext ctx = web.GetContext();
                HttpListenerRequest req = ctx.Request;
                string endpoint = req.Url.AbsolutePath;

                // Handle OPTIONS preflight requests (CORS)
                if (req.HttpMethod == "OPTIONS")
                {
                    SendCORSResponse(ctx.Response);
                    continue;
                }

                if (endpoint == "/data/")
                {
                    using (StreamReader reader = new StreamReader(req.InputStream, req.ContentEncoding))
                    {
                        Console.WriteLine("GOT A SCRIPT! " + DateTime.Now);
                        string script = reader.ReadToEnd();
                        // Console.WriteLine(script);
                        QuorumAPI.QuorumAPI.ExecuteScript(script); // Execute the script using Quorum API, add your api into the project reference and put your own API function
                    }

                    SendResponse(ctx.Response, req, "Script received.");
                }
                else if (endpoint == "/attach/")
                {
                    Console.WriteLine("Received request at /attach - " + DateTime.Now);
                    QuorumAPI.QuorumAPI.AttachAPI(); // Attach the API to the Roblox process, Using Quorum API, add your api into the project reference and put your own API function
                    SendResponse(ctx.Response, req, "Attached API.");
                }
                /*

                Add more endpoints here for different functionalities

                */
                else if (endpoint == "/stop/")
                {
                    SendResponse(ctx.Response, req, "Stopping server...");
                    web.Stop();
                    break;
                }
                else
                {
                    SendResponse(ctx.Response, req, "Invalid endpoint", HttpStatusCode.NotFound);
                }
            }
        }

        static void SendResponse(HttpListenerResponse response, HttpListenerRequest request, string message, HttpStatusCode statusCode = HttpStatusCode.OK)
        {
            byte[] buffer = Encoding.UTF8.GetBytes(message);
            response.StatusCode = (int)statusCode;
            response.ContentLength64 = buffer.Length;

            // Allow all localhost ports (use request's origin dynamically)
            string origin = request.Headers["Origin"];
            if (!string.IsNullOrEmpty(origin) && origin.StartsWith("http://localhost"))
            {
                response.Headers.Add("Access-Control-Allow-Origin", origin);
            }
            else
            {
                response.Headers.Add("Access-Control-Allow-Origin", "*"); // Default to *
            }

            response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            response.Headers.Add("Access-Control-Allow-Headers", "Content-Type");

            response.OutputStream.Write(buffer, 0, buffer.Length);
            response.OutputStream.Close();
        }

        static void SendCORSResponse(HttpListenerResponse response)
        {
            response.StatusCode = (int)HttpStatusCode.OK;
            response.Headers.Add("Access-Control-Allow-Origin", "*");
            response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            response.Headers.Add("Access-Control-Allow-Headers", "Content-Type");
            response.OutputStream.Close();
        }
    }
}
