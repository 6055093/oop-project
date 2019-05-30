//Create the Item, Potion, Bomb and Key class

class Item extends Entity {
  constructor(value, rarity, type) {
    let src = './imgs/items/' + type + '.png';
    super(src);
    for (let i = 0; i < ITEM_RARITIES.length; i++) {
      if (i === rarity) {
        this.name = ITEM_RARITIES[i] + type;
      }
    }
    this.value = value;
    this.rarity = rarity;
    this.sound = './sounds/loot.mp3';
  }
}
/*
Item class definition. Item is an Entity
- constructor
  - parameters: value (number), rarity (number), type (string)
  - Creates an item with the correct image (depends on type).
  - Sets the name based on the rarity (with ITEM_RARITIES) and the type.
- name (string)
- value (number)
- rarity (number)
- sound (Audio object - type is used for the sound file path)
Example use: not used by itself. 
*/

class Potion extends Item {
  constructor(rarity) {
    super((rarity + 1) * 10, rarity, 'potion');
    this.potency = (rarity + 1) * 10;
  }
  use(target) {
    target.hp = target.hp + this.potency;
    if (target.hp >= target.getMaxHp()) {
      target.hp = target.getMaxHp();
    }
  }
  //   playSound()
}
/*
Potion class definition. Potion is an Item
- constructor
  - parameters: rarity (number)
  - Creates a potion with type 'potion' and a value based on rarity: (rarity + 1) * 10
- potency (number): (rarity + 1) * 10
- use (function)
 - parameters: target (Creature)
 - Restores hp of target by potency value. HP of target can't go past its max HP.
 - Plays the item sound
Example use:
new Potion(0) // potion rarity 0
*/

class Bomb extends Item {
  constructor(rarity) {
    super((rarity + 1) * 20, rarity, 'bomb');
    this.damage = (rarity + 1) * 30;
  }
  use(target) {
    target.hp = target.hp - this.damage;
    if (target.hp <= 0) {
      target.hp = 0;
    }
  }
  //   playSound()
}
/*
Bomb class definition. Bomb is an Item
- constructor
  - parameters: rarity (number)
  - Creates a bomb with type 'bomb' and a value based on rarity: (rarity + 1) * 20
- damage (number): (rarity + 1) * 30
- use (function)
 - parameters: target (Creature)
 - Damages hp of target by damage value. HP of target can't be lower than 0.
 - Plays the item sound
Example use:
new Bomb(0) // bomb rarity 0
*/

class Key extends Item {
  constructor() {
    super(100, 3, 'key');
  }
  use(target) {
    target.isOpen = true;
    if (target.hasPrincess === false) {
      playSound('loot');
    }
  }
}
/*
Key class definition. Key is an Item
- constructor
  - parameters: none
  - Creates a key with value 100, rarity 3 and type 'key'
- use (function)
 - parameters: target (Dungeon)
 - opens the dungeon and plays the item sound if the dungeon does not have the princess
Example use:
new Key(0) // bomb rarity 0
*/
