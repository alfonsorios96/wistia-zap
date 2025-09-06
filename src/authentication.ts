import type { ZObject, Bundle, Authentication } from 'zapier-platform-core';

// You want to make a request to an endpoint that is either specifically designed
// to test auth, or one that every user will have access to. eg: `/me`.
// By returning the entire request object, you have access to the request and
// response data for testing purposes. Your connection label can access any data
// from the returned response using the `json.` prefix. eg: `{{json.username}}`.
const test = async (z: ZObject, bundle: Bundle) => {
  const response = await z.request({
    url: 'https://api.wistia.com/v1/medias.json',
    params: {
      per_page: 1,
    },
  });

  if (response.status !== 200) {
    throw new Error('Authentication failed. Please check your API token.');
  }

  // If we get here, the auth worked
  return response.data;
}

export default {
  // "custom" is the catch-all auth type. The user supplies some info and Zapier can
  // make authenticated requests with it
  type: 'custom',

  // Define any input app's auth requires here. The user will be prompted to enter
  // this info when they connect their account.
  fields: [{ key: 'apiKey', label: `Go to the [API Key details](https://tenant.wistia.com/account/api) screen from your
Website Dashboard to find your API Key. Use subdomain instead of tenant.`, required: true }],

  // The test method allows Zapier to verify that the credentials a user provides
  // are valid. We'll execute this method whenever a user connects their account for
  // the first time.
  test,

  // This template string can access all the data returned from the auth test. If
  // you return the test object, you'll access the returned data with a label like
  // `{{json.X}}`. If you return `response.data` from your test, then your label can
  // be `{{X}}`. This can also be a function that returns a label. That function has
  // the standard args `(z: ZObject, bundle: Bundle)` and data returned from the
  // test can be accessed in `bundle.inputData.X`.
  connectionLabel: '{{json.username}}',
} satisfies Authentication;
