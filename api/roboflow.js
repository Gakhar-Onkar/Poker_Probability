export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image, modelId, modelVersion } = req.body;

  try {
    const response = await fetch(
    `https://serverless.roboflow.com/${modelId}/${modelVersion}?api_key=${process.env.ROBOFLOW_API_KEY}`,
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: image,
    }
    );

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}