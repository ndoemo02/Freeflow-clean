(() => {
  if (!('geolocation' in navigator)) return;

  const geo = navigator.geolocation;
  const origGet = geo.getCurrentPosition.bind(geo);

  async function byIP() {
    try {
      const r = await fetch('https://ipapi.co/json/');
      const j = await r.json();
      if (j && typeof j.latitude === 'number' && typeof j.longitude === 'number') {
        return { lat: j.latitude, lon: j.longitude, acc: 5000 };
      }
    } catch (e) {}
    // Domyślnie: Kraków
    return { lat: 50.0614, lon: 19.9366, acc: 10000 };
  }

  function asPosition({ lat, lon, acc }) {
    return {
      coords: {
        latitude: lat,
        longitude: lon,
        accuracy: acc
      },
      timestamp: Date.now()
    };
  }

  navigator.geolocation.getCurrentPosition = function (success, error, options = {}) {
    let done = false;
    const to = typeof options.timeout === 'number' ? options.timeout : 5000;

    const finish = (pos) => { if (!done) { done = true; success(pos); } };
    const fail = async () => {
      if (done) return;
      done = true;
      const ip = await byIP();
      finish(asPosition(ip));
    };

    const timer = setTimeout(fail, to);

    try {
      origGet(
        (pos) => { if (!done) { done = true; clearTimeout(timer); success(pos); } },
        async (_err) => { clearTimeout(timer); await fail(); },
        options
      );
    } catch (_e) {
      clearTimeout(timer);
      fail();
    }
  };
})();
