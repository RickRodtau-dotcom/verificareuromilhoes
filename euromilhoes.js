// netlify/functions/euromilhoes.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async (event, context) => {
  try {
    // 👉 AQUI colocas a URL de um API que devolva os sorteios do Euromilhões
    // Exemplo genérico – substitui pela API real que decidires usar
    const apiUrl = 'https://www.lotterystats.co.uk/euromillions/results';

    const resp = await fetch(apiUrl);
    if (!resp.ok) {
      throw new Error(`Erro ao pedir ao API: ${resp.status}`);
    }

    const data = await resp.json();

    // Ajusta este mapeamento ao formato REAL que o API te devolver
    const draws = data.draws
      ? data.draws
      : data; // se a API devolver um array simples

    const normalizado = draws.map(d => {
      // tenta adivinhar campos comuns – depois ajustas ao teu caso
      const date = d.date || d.draw_date || d.drawDate;
      const main = d.main || d.numbers || d.balls || [];
      const stars = d.stars || d.lucky_stars || d.luckyStars || [];

      return {
        date,
        main: (main || []).map(Number),
        stars: (stars || []).map(Number),
      };
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        // para poderes testar localmente se quiseres
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ draws: normalizado }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Falha ao obter sorteios do Euromilhões.' }),
    };
  }
};
