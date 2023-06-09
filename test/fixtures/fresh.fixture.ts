import { deployRamsey } from '../../scripts/utils';

export async function freshFixture() {
  const chefRamsey = await deployRamsey();

  return {
    chefRamsey,
  };
}
