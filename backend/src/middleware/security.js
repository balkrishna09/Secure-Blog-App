/**
 * Security middleware to implement various HTTP security headers and CORS configuration
 * This middleware runs on every request to protect the application
 */
const securityMiddleware = (req, res, next) => {
  // Remove X-Powered-By header to prevent information disclosure about the server technology
  res.removeHeader('X-Powered-By');
  
  // Content Security Policy (CSP) header
  // Controls which resources the browser is allowed to load
  // 'self' - Only allow resources from same origin
  // 'unsafe-inline'/'unsafe-eval' - Allow inline scripts and eval (needed for some frontend frameworks)
  // data: - Allow data URIs for images and fonts
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +                   // Default: only allow from same origin
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " + // Scripts: allow inline and eval
    "style-src 'self' 'unsafe-inline'; " +     // Styles: allow inline
    "img-src 'self' data: https:; " +          // Images: allow from same origin, data URIs, and HTTPS
    "font-src 'self' data:; " +                // Fonts: allow from same origin and data URIs
    "connect-src 'self'"                       // AJAX/WebSocket: only allow to same origin
  );
  
  // X-Frame-Options header
  // Prevents clickjacking attacks by disabling iframe embedding
  res.setHeader('X-Frame-Options', 'DENY');
  
  // X-XSS-Protection header
  // Enables browser's built-in XSS filtering
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // X-Content-Type-Options header
  // Prevents MIME-type sniffing which could lead to security vulnerabilities
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Cross-Origin Resource Sharing (CORS) headers
  // Controls which domains can access the API
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');  // Only allow requests from our frontend
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');      // Allowed request headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');  // Allow credentials (cookies, authorization headers)
  
  // Handle CORS preflight requests
  // Browsers send OPTIONS request before actual request to check CORS permissions
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Continue to next middleware
  next();
};

module.exports = securityMiddleware; 