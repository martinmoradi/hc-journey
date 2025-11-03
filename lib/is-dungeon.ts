const dungeons = new Set([
  'ragefire_chasm',
  'wailing_caverns',
  'the_deadmines',
  'shadowfang_keep',
  'the_stockades',
  'gnomeregan',
  'razorfen_kraul',
  'scarlet_monastery',
  'razorfen_downs',
  'uldaman',
  'zul_farrak',
  'maraudon',
  'sunken_temple',
  'blackrock_depths',
  'blackrock_spire',
]);

export const isDungeon = (zone: string) => {
  return dungeons.has(zone);
};
