export default async function handler(req, res) {

  const response = await fetch(
    "https://api.football-data.org/v4/competitions/PD/standings",
    {
      headers: {
        "X-Auth-Token": "TU_API_KEY"
      }
    }
  );

  const data = await response.json();

  res.status(200).json(data);
}
