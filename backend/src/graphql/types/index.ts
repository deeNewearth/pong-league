import { mergeTypes } from 'merge-graphql-schemas';

import movie from './game.graphql';
import character from './player.graphql';

export default mergeTypes([movie, character], { all: true });