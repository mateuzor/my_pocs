// Nó da árvore: armazena o valor, referências para filhos e a altura atual
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1; // todo nó novo começa com altura 1 (folha)
  }
}

// Árvore AVL: árvore binária de busca auto-balanceada
// Garante que a diferença de altura entre subárvores (fator de balanço) seja sempre -1, 0 ou 1
class AVLTree {
  constructor() {
    this.root = null;
  }

  // Retorna a altura do nó (0 se nulo, para simplificar os cálculos)
  height(node) {
    return node ? node.height : 0;
  }

  // Fator de balanço: altura da subárvore esquerda menos a direita
  // Positivo = pesado à esquerda | Negativo = pesado à direita
  balanceFactor(node) {
    return node ? this.height(node.left) - this.height(node.right) : 0;
  }

  // Recalcula a altura do nó com base nos filhos
  updateHeight(node) {
    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
  }

  // Rotação simples para a direita (caso Esquerda-Esquerda)
  //       y                x
  //      / \              / \
  //     x   T3   =>     T1   y
  //    / \                  / \
  //   T1  T2              T2  T3
  rotateRight(y) {
    const x = y.left;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    this.updateHeight(y);
    this.updateHeight(x);

    return x; // x passa a ser a nova raiz do subárvore
  }

  // Rotação simples para a esquerda (caso Direita-Direita)
  //     x                  y
  //    / \                / \
  //   T1   y    =>       x   T3
  //       / \           / \
  //      T2  T3        T1  T2
  rotateLeft(x) {
    const y = x.right;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    this.updateHeight(x);
    this.updateHeight(y);

    return y; // y passa a ser a nova raiz do subárvore
  }

  // Verifica o fator de balanço e aplica as rotações necessárias
  balance(node) {
    this.updateHeight(node);
    const bf = this.balanceFactor(node);

    // Pesado à esquerda (bf > 1)
    if (bf > 1) {
      if (this.balanceFactor(node.left) < 0) {
        node.left = this.rotateLeft(node.left); // caso Esquerda-Direita: rotaciona filho antes
      }
      return this.rotateRight(node); // caso Esquerda-Esquerda: uma rotação resolve
    }

    // Pesado à direita (bf < -1)
    if (bf < -1) {
      if (this.balanceFactor(node.right) > 0) {
        node.right = this.rotateRight(node.right); // caso Direita-Esquerda: rotaciona filho antes
      }
      return this.rotateLeft(node); // caso Direita-Direita: uma rotação resolve
    }

    return node; // já está balanceado
  }

  // Insere um valor na árvore e rebalanceia automaticamente
  insert(value) {
    this.root = this._insert(this.root, value);
  }

  _insert(node, value) {
    if (!node) return new Node(value); // posição de inserção encontrada

    if (value < node.value) {
      node.left = this._insert(node.left, value);
    } else if (value > node.value) {
      node.right = this._insert(node.right, value);
    } else {
      return node; // valores duplicados são ignorados
    }

    return this.balance(node); // rebalanceia no caminho de volta da recursão
  }

  // Remove um valor da árvore e rebalanceia automaticamente
  delete(value) {
    this.root = this._delete(this.root, value);
  }

  _delete(node, value) {
    if (!node) return null; // valor não encontrado

    if (value < node.value) {
      node.left = this._delete(node.left, value);
    } else if (value > node.value) {
      node.right = this._delete(node.right, value);
    } else {
      // Nó encontrado: casos com 0 ou 1 filho
      if (!node.left || !node.right) {
        return node.left || node.right;
      }
      // Nó com dois filhos: substitui pelo sucessor in-order (menor valor da subárvore direita)
      const successor = this._minNode(node.right);
      node.value = successor.value;
      node.right = this._delete(node.right, successor.value);
    }

    return this.balance(node); // rebalanceia no caminho de volta da recursão
  }

  // Percorre para a esquerda até encontrar o menor nó da subárvore
  _minNode(node) {
    while (node.left) node = node.left;
    return node;
  }

  // Busca um valor na árvore — O(log n) graças ao balanceamento
  search(value) {
    return this._search(this.root, value);
  }

  _search(node, value) {
    if (!node) return false;
    if (value === node.value) return true;
    // Desce para a esquerda ou direita conforme a comparação
    return value < node.value
      ? this._search(node.left, value)
      : this._search(node.right, value);
  }

}

// --- Demo ---
const tree = new AVLTree();

console.log('=== AVL Tree POC ===\n');

// Sequência que sem balanceamento geraria uma árvore degenerada (lista encadeada)
const values = [10, 20, 30, 40, 50, 25];
console.log('Inserindo:', values);
values.forEach(v => tree.insert(v));

console.log('Busca por 25:', tree.search(25));
console.log('Busca por 99:', tree.search(99));

console.log('\nRemovendo 40...');
tree.delete(40);
