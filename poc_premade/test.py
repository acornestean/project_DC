import http.server
from http.server import HTTPServer, BaseHTTPRequestHandler
import socketserver

Handler = http.server.SimpleHTTPRequestHandler
Handler.extensions_map={'.xpi': 'x-xpinstall'}

PORT = 8000
httpd = socketserver.TCPServer(("", PORT), Handler)
print("HTTP Server started", PORT)
httpd.serve_forever()