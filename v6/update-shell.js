(() => {
  'use strict';

  /*
    The functional app already owns the service-worker registration.
    This file intentionally performs no second registration and no forced reload.
    Keeping a single owner prevents alternating workers, controller-change loops,
    blinking, and unstable layout refreshes on Android.
  */
})();
