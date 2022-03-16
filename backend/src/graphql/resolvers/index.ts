import { mergeResolvers } from 'merge-graphql-schemas';
import movieResolver from './game';
import characterResolver from './player';

const resolvers = [movieResolver, characterResolver];

export default mergeResolvers(resolvers);