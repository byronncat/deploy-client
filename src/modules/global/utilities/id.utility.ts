import { nanoid } from 'nanoid';

function generate() {
  return nanoid();
}

export const id = {
  generate,
};
