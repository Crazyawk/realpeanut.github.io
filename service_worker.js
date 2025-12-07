// service-worker.js
const CACHE_NAME = "polytrack-offine";
const ASSETS = [
  "/",                 // index.html
  "/index.html",
  "/main.bundle.js",
  "/simulation_worker.bundle.js",
  "/error_screen.bundle.js",
  "/manifest.json",
  "/forced_square.json",
  "/forced_square.woff2",
  "/err.log",
  "/tracks/community/90_reset.track",
  "/tracks/community/alpine_descent.track",
  "/tracks/community/anubis.track",
  "/tracks/community/arabica.track",
  "/tracks/community/asguardia.track",
  "/tracks/community/clay_temples.track",
  "/tracks/community/concrete_jungle.track",
  "/tracks/community/desert_stallion.track",
  "/tracks/community/flying_dreams.track",
  "/tracks/community/ghost_city.track",
  "/tracks/community/hyperions_sanctuary.track",
  "/tracks/community/japan.track",
  "/tracks/community/joenail_jones.track",
  "/tracks/community/las_calles.track",
  "/tracks/community/last_remnant.track",
  "/tracks/community/lu_muvimento.track",
  "/tracks/community/malformations.track",
  "/tracks/community/mos_espa.track",
  "/tracks/community/natsujo.track",
  "/tracks/community/opal_place_ii.track",
  "/tracks/community/oxygen_not_included.track",
  "/tracks/community/pavlova_dip.track",
  "/tracks/community/re_akina.track",
  "/tracks/community/sandline_ultimatum.track",
  "/tracks/community/snow_park.track",
  "/tracks/community/winter_hollow.track",
  "/tracks/community/winterfell.track",
  "/tracks/official/desert1.track",
  "/tracks/official/desert2.track",
  "/tracks/official/desert3.track",
  "/tracks/official/desert4.track",
  "/tracks/official/summer1.track",
  "/tracks/official/summer2.track",
  "/tracks/official/summer3.track",
  "/tracks/official/summer4.track",
  "/tracks/official/summer5.track",
  "/tracks/official/summer6.track",
  "/tracks/official/summer7.track",
  "/tracks/official/winter1.track",
  "/tracks/official/winter2.track",
  "/tracks/official/winter3.track",
  "/tracks/official/winter4.track",
  "/models/blocks.glb",
  "/models/car.glb",
  "/models/pillar.glb",
  "/models/planes.glb",
  "/models/road.glb",
  "/models/road_wide.glb",
  "/models/signs.glb",
  "/models/wall_track.glb",
  "/lib/ammo.wasm.js",
  "/lib/ammo.wasm.wasm",   // include the wasm binary if local
  "/lib/draco/draco_wasm_wrapper.js",
  "/lib/draco/draco_decoder.wasm", // also include decoder binary
  "/audio/click.ogg",
  "/audio/engine.ogg",
  "/audio/checkpoint.ogg",
  "/audio/collision.ogg",
  "/audio/editor_edit.ogg",
  "/audio/music.ogg",
  "/audio/skidding.ogg",
  "/audio/suspension.ogg",
  "/audio/tires.ogg",
  "/images/apply.svg",
  "/images/arrow_down.svg",
  "/images/arrow_left.svg",
  "/images/arrow_right.svg",
  "/images/arrow_up.svg",
  "/images/back.svg",
  "/images/cancel.svg",
  "/images/car_stripe.svg",
  "/images/car_thumbnail_placeholder.png",
  "/images/checkmark.svg",
  "/images/checkpoint.svg",
  "/images/clouds.jpg",
  "/images/community_tracks.jpg",
  "/images/copy.svg",
  "/images/custom_tracks.jpg",
  "/images/customize.svg",
  "/images/delete.svg",
  "/images/desert.svg",
  "/images/desert_colored.svg",
  "/images/discord.svg",
  "/images/editor.svg",
  "/images/empty.svg",
  "/images/erase.svg",
  "/images/export.svg",
  "/images/fullscreen.svg",
  "/images/grid_large.svg",
  "/images/grid_small.svg",
  "/images/helmet.svg",
  "/images/help.svg",
  "/images/icon.svg",
  "/images/import.svg",
  "/images/load.svg",
  "/images/logo.svg",
  "/images/official_tracks.jpg",
  "/images/overlapping_disabled.svg",
  "/images/overlapping_enabled.svg",
  "/images/pause.svg",
  "/images/pending.svg",
  "/images/pin.svg",
  "/images/play.svg",
  "/images/preview.svg",
  "/images/quit.svg",
  "/images/random.svg",
  "/images/redo.svg",
  "/images/reset.svg",
  "/images/reset_settings.svg",
  "/images/rotate.svg",
  "/images/rotation_axis_x_negative.svg",
  "/images/rotation_axis_x_positive.svg",
  "/images/rotation_axis_y_negative.svg",
  "/images/rotation_axis_y_positive.svg",
  "/images/rotation_axis_z_negative.svg",
  "/images/rotation_axis_z_positive.svg",
  "/images/save.svg",
  "/images/search.svg",
  "/images/settings.svg",
  "/images/share.svg",
  "/images/smoke.png",
  "/images/state_invalid.svg",
  "/images/state_pending.svg",
  "/images/state_verified.svg",
  "/images/summer.svg",
  "/images/test.svg",
  "/images/timer.svg",
  "/images/trophy.svg",
  "/images/undo.svg",
  "/images/verified.svg",
  "/images/windowed.svg",
  "/images/winter.svg",
  "/images/winter_colored.svg",
  
];

// Install event: cache everything
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// Fetch event: serve from cache, block externals
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // Only allow same-origin requests (your PWA files)
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  } else {
    // Block external requests — return empty response
    event.respondWith(
      new Response("", { status: 404, statusText: "Offline Only" })
    );
  }
});
