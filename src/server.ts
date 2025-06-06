// @ts-ignore
import { createApp } from 'turborepo-remote-cache';
// @ts-ignore
import closeWithGrace from 'close-with-grace';

export const ONE_HUNDRED_MB = 1024 * 1024 * 100;

const app = createApp({
  bodyLimit: ONE_HUNDRED_MB,
  logger: true,
})

closeWithGrace(
  { delay: 5000 },
  async function ({ err, signal }: { err?: Error; signal?: string }) {
    if (err) {
      app.log.error(err)
    }

    app.log.info(`[${signal}] Gracefully closing the server instance.`)

    await app.close()
  },
)


export function startApp() {
  app.listen({ host: '0.0.0.0', port: '8585' }, (err: any, address: any) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  console.log(`Listening on ${address}`);
});
}
