# Deployment

The Astro source lives in `website/`. Pushes to `new_web` are built by GitHub
Actions and the generated static files are committed to `website/dist/`.

cPanel tracks the same branch. After updating the repository from the remote,
use **Deploy HEAD Commit**. The root `.cpanel.yml` copies the generated site to
`/home/krismsir/public_html`.

The domain must use these nameservers:

- `clns1.iranhost.com`
- `clns2.iranhost.com`

After DNS propagation, run cPanel AutoSSL so `https://krisms.ir` receives a
trusted certificate.
