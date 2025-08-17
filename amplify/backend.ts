import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { helloWorld } from './functions/hello-world/resource';

defineBackend({
  auth,
  data,
  helloWorld,
});
