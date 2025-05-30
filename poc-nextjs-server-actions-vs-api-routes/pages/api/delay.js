export default async function handler(req, res) {
  const start = Date.now();
  await new Promise((resolve) => setTimeout(resolve, 100));
  const duration = Date.now() - start;
  console.log('API Route duration:', duration);
  res.status(200).json({ duration });
}