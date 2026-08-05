# embed-snippet

Vanilla JS embed snippet that is responsible to fetch @calcom/embed-core and thus show Cal Link as an embed on a page.

## Configuring with an API key instead of a Cal Link

Every `inline`, `floatingButton`, and `modal` instruction accepts `apiKey` as an alternative to `calLink`. This lets a
site owner paste in an API key generated from **Developer > API Keys** without needing to know or expose their
Slottr username or event-type slug:

```html
<script>
  Cal("inline", {
    elementOrSelector: "#my-cal-inline",
    apiKey: "cal_live_xxxxxxxxxxxxxxxx",
  });
</script>
```

Provide exactly one of `calLink` or `apiKey`. When `apiKey` is given, the embed first calls the public
`/api/embed/resolve` endpoint on the Cal origin to resolve it to the user's default bookable event type, then
proceeds with the normal embed flow.

## Development

`yarn build` will generate dist/snippet.es.js. If you are going to test react embeds, make sure that you have built it so that they get the upto-date snippet

- which can be used as `<script type="module" src=...`
- You can also copy the appropriate portion of the code and install it directly as `<script>CODE_SUGGESTED_TO_BE_COPIED</script>`
