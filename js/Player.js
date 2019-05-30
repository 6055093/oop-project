//Create the Player class

class Player extends Creature {
  constructor(name, position, board, level, items, gold) {
    super(name, './imgs/player/front.png', level, items, gold);
    this.attackSpeed = 2000 / level;
    this.exp = 0;
    this.position = position;
    this.board = board;
  }
  render(root) {
    root.appendChild(this.element);
    this.element.style.position = 'absolute';
    player.position.row = player.position.row - 1;
    player.position.column = player.position.column - 1;
  }
  update() {
    this.element.style.left =
      (this.position.column + 1) * ENTITY_SIZE - ENTITY_SIZE + 'px';
    this.element.style.top =
      (this.position.row + 1) * ENTITY_SIZE - ENTITY_SIZE + 'px';
  }
  moveToPosition(Position) {
    if (
      Position.row === 0 ||
      Position.row === board.rows.length - 1 ||
      Position.column === 0 ||
      Position.column === board.rows[0].length - 1
    ) {
      return console.log("Can't move there!");
    } else {
      this.position = Position;
      this.update();
    }
  }
  move(direction) {
    if (direction === 'ArrowLeft') {
      this.setImg('./imgs/player/left.png');
      this.moveToPosition(
        new Position(player.position.row, player.position.column - 1)
      );
    }
    if (direction === 'ArrowRight') {
      this.setImg('./imgs/player/right.png');
      this.moveToPosition(
        new Position(player.position.row, player.position.column + 1)
      );
    }
    if (direction === 'ArrowUp') {
      this.setImg('./imgs/player/back.png');
      this.moveToPosition(
        new Position(player.position.row - 1, player.position.column)
      );
    }
    if (direction === 'ArrowDown') {
      this.setImg('./imgs/player/front.png');
      this.moveToPosition(
        new Position(player.position.row + 1, player.position.column)
      );
    }
  }
  pickup(entity) {
    if (entity === newBomb || entity === newPotion || entity === newGold) {
      if (
        player.position.row === entity.position.row &&
        player.position.column === entity.position.column
      ) {
        if (entity === newGold) {
          playSound('gold');
          player.gold += entity.value;
          clearEntity(entity.position);
          return console.log('Picked up gold!');
        }
        player.items.push(entity);
        playSound('loot');
        clearEntity(entity.position);
        console.log('Item picked up!');
      } else {
        console.log('Item not picked up');
      }
    } else {
      return;
    }
  }
  attack(entity) {
    super.attack(entity);
    if (player.attacking) {
      playSound('pattack');
    }
  }
  buy(item, tradesman) {
    if (!item) {
      console.log('No such item!');
      return false;
    } else if (item.value < player.gold) {
      player.items.push(item);
      tradesman.items = tradesman.items.filter(obj => obj.name !== item.name);
      player.gold -= item.value;
      playSound('trade');
      return true;
    }
    return false;
  }
  sell(item, tradesman) {
    if (!item) {
      console.log('No such item!');
      return false;
    } else {
      tradesman.items.push(item);
      player.items = player.items.filter(obj => obj.name !== item.name);
      player.gold += item.value;
      playSound('trade');
    }
  }
  useItem(itemName, target) {
    const item = player.items.find(item => item.name === itemName.name);
    if (!item) {
      console.log('No such Item');
    } else {
      if (target) item.use(target);
      else if (item.name.includes('Potion')) item.use(player);
      else item.use(board.getEntity(player.position));
      remove(player.items, item);
    }
  }
  loot(entity) {
    entity.items.forEach(x => player.items.push(x));
    player.gold += entity.gold;
    entity.items = [];
    entity.gold = 0;
  }
  getExpToLevel() {
    return this.level * 10;
  }
  getExp(entity) {
    player.exp += entity.level * 10;
    if (this.exp > this.getExpToLevel()) this.levelUp(player);
  }
  levelUp(entity) {
    entity.level++;
    entity.hp = entity.getMaxHp();
    entity.strength = entity.level * 10;
    entity.attackSpeed = 3000 / entity.level;
  }
}
/*
Player class definition. Player is a Creature
- constructor
  - parameters: name (string), position (Position), board (Board), level (number), items (Item[]), gold (number)
  - Sets the attackSpeed to 2000 / level
  - Sets the exp to 0
  - Sets the position and board
- attackSpeed (number)
- exp (number)
- position (Position)
- board (Board)
- render (function)
  - parameters: root (HTMLElement)
  - Appends the element to the root (the board HTML element)
  - Updates the player position
- update (function)
  - parameters: none
  - Updates the player's HTML element position based on its position property and ENTITY_SIZE
- moveToPosition (Position)
  - moves to position specified unless it is a Wall entity.
  - updates player (update method)
- move (function)
  - parameters: direction (string)
  - Sets the player image based on direction and moves to new position
- pickup (function)
  - parameters: entity (Item || Gold)
  - Adds item or gold and plays the corresponding sound ('loot' or 'gold' respectively)
- attack (function)
  - parameters: (entity)
  - calls the attack method from Creature (use super) and plays the 'pattack' sound if the attack was successful
- buy (function)
  - parameters: item (Item), tradesman (Tradesman)
  - updates gold and items for both player and tradesman.
  - Plays the trade sound
  - returns true if successful trade, false if gold is insufficient
- sell (function)
  - parameters: item (Item), tradesman (Tradesman)
  - updates gold and items for both player and tradesman.
  - Plays the trade sound
  - returns true if successful trade, false if gold is insufficient
- useItem (function)
  - parameters: item (Item), target (Creature)
  - uses the item on the target and removes it from the player
- loot (function)
  - parameters: entity (Monster || Dungeon)
  - Updates gold and items for both player and dungeon or monster.
  - plays the loot sound
- getExpToLevel (function)
  - parameters: none
  - returns exp needed to level: level * 10
- getExp (function)
  - parameters: entity (Monster)
  - adds exp based on entity level (level * 10)
  - level up if enough exp. It is possible to level up multiple times at once if enough exp is earned (e.g. beat enemy level 3)
- levelUp (function)
  - parameters: entity (Player)
  - Increments level, sets hp to max hp
  - updates strength (level * 10) and attack speed (3000 / level)
  - plays levelup sound
Example use:
new Player('Van', new Position(5, 5), new Board(10, 10), 1, [new Potion(0)]);
*/
