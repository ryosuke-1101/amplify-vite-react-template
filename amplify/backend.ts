import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { helloWorld } from './functions/hello-world/resource';
import { todoProcessor } from './functions/todo-processor/resource';

defineBackend({
  auth,
  data,
  helloWorld,
  todoProcessor,
});
