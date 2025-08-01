import { rest } from 'msw';

// Mock data structures
const mockToken = 'test_jwt_token';

// Users
let users = [
  { username: 'admin', password: 'adminpass', full_name: 'Admin User' }
];

// Devices
let devices = [
  { id: 1, name: 'Router1', mac: 'AA:BB:CC:DD:EE:01', ip: '192.168.1.10', device_status: 'online' }
];

// Configs
let configs = [
  { id: 1, device_id: 1, ssid: 'HomeWiFi', password: 'secret123', channel: 36, wpa3_enabled: true }
];

export const handlers = [
  // Registration
  rest.post('/users/register', (req, res, ctx) => {
    const { username, password, full_name } = req.body;
    // Simulate unavailable username
    if (users.find(u => u.username === username)) {
      return res(ctx.status(400), ctx.json({ detail: "Registration failed. Try a different username." }));
    }
    users.push({ username, password, full_name });
    return res(ctx.status(200), ctx.json({ username, full_name }));
  }),

  // Login
  rest.post('/users/login', async (req, res, ctx) => {
    const params = req.body instanceof URLSearchParams
      ? Object.fromEntries(req.body.entries())
      : req.body;
    const { username, password } = params || {};
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      return res(ctx.status(200), ctx.json({ access_token: mockToken, token_type: "bearer" }));
    }
    return res(ctx.status(401), ctx.json({ detail: "Login failed: invalid credentials" }));
  }),

  // Get current user (authenticated)
  rest.get('/users/me', (req, res, ctx) => {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${mockToken}`) {
      return res(ctx.status(401), ctx.json({ detail: "Unauthorized" }));
    }
    return res(ctx.status(200), ctx.json({ username: 'admin', full_name: 'Admin User' }));
  }),

  // Devices list
  rest.get('/devices/', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(devices));
  }),

  // Devices CRUD (get by id, post, put, delete)
  rest.get('/devices/:id', (req, res, ctx) => {
    const device = devices.find(d => d.id === parseInt(req.params.id, 10));
    if (!device) return res(ctx.status(404));
    return res(ctx.status(200), ctx.json(device));
  }),
  rest.post('/devices/', (req, res, ctx) => {
    const id = devices.length ? devices[devices.length - 1].id + 1 : 1;
    devices.push({ id, ...req.body, device_status: "offline" });
    return res(ctx.status(201), ctx.json(devices[devices.length - 1]));
  }),
  rest.put('/devices/:id', (req, res, ctx) => {
    const idx = devices.findIndex(d => d.id === parseInt(req.params.id, 10));
    if (idx === -1) return res(ctx.status(404));
    devices[idx] = { ...devices[idx], ...req.body };
    return res(ctx.status(200), ctx.json(devices[idx]));
  }),
  rest.delete('/devices/:id', (req, res, ctx) => {
    devices = devices.filter(d => d.id !== parseInt(req.params.id, 10));
    return res(ctx.status(204));
  }),

  // Configs list
  rest.get('/configs/', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(configs));
  }),

  // Configs CRUD
  rest.get('/configs/:id', (req, res, ctx) => {
    const config = configs.find(c => c.id === parseInt(req.params.id, 10));
    if (!config) return res(ctx.status(404));
    return res(ctx.status(200), ctx.json(config));
  }),
  rest.post('/configs/', (req, res, ctx) => {
    const id = configs.length ? configs[configs.length - 1].id + 1 : 1;
    configs.push({ id, ...req.body });
    return res(ctx.status(201), ctx.json(configs[configs.length - 1]));
  }),
  rest.put('/configs/:id', (req, res, ctx) => {
    const idx = configs.findIndex(c => c.id === parseInt(req.params.id, 10));
    if (idx === -1) return res(ctx.status(404));
    configs[idx] = { ...configs[idx], ...req.body };
    return res(ctx.status(200), ctx.json(configs[idx]));
  }),
  rest.delete('/configs/:id', (req, res, ctx) => {
    configs = configs.filter(c => c.id !== parseInt(req.params.id, 10));
    return res(ctx.status(204));
  }),

  // Health check (optional)
  rest.get('/', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ status: "ok" }));
  })
];
