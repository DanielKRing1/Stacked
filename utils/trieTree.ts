import { genUID } from './uid';

type TrieNode = {
    branches: {
        [branchKey: string]: TrieNode;
    };
    children: any[];
};

export class TrieTree {
    root: TrieNode = this.makeNode();

    constructor(list: string[] = []) {
        list.forEach((str) => this.add(str));
    }

    makeNode(): TrieNode {
        return {
            branches: {},
            children: [],
        };
    }

    cascadeNewBranch(fullString: string, index: number, children: any[]): TrieNode {
        // 1. Make new TrieNode
        const node: TrieNode = this.makeNode();
        // console.log('a');

        // 2. Get letter for next branch
        const nextLetter: string = fullString.charAt(index);
        index++;

        // 3.1. Done; push children
        if (index > fullString.length) {
            node.children.push(...children);
        }
        // 3.2. Not done; cascade further
        else node.branches[nextLetter] = this.cascadeNewBranch(fullString, index, children);

        return node;
    }

    add(fullString: string, children: any[] = [fullString]): void {
        const { branch, index }: { branch: TrieNode; index: number } = this.getNode(fullString);
        // console.log(index);

        const leafLetter: string = fullString.charAt(index);
        if (index + 1 <= fullString.length) branch.branches[leafLetter] = this.cascadeNewBranch(fullString, index + 1, children);
    }

    getNode(searchString: string): { branch: TrieNode; index: number; found: boolean } {
        let index: number = 0;
        let nextLetter: string = searchString.charAt(index);

        // 1. Search for leaf TrieNode
        let searchingForLeaf: boolean = true;
        let branch: TrieNode = this.root;
        while (searchingForLeaf && index < searchString.length) {
            if (index > 0) {
                // console.log('branchhh');
                // console.log(branch);
            }

            // 2. Check if branch exists
            searchingForLeaf = !!branch.branches[nextLetter];
            if (searchingForLeaf) {
                branch = branch.branches[nextLetter];
                // console.log('in');

                // 3. Get letter of next branch
                index++;
                nextLetter = searchString.charAt(index);
            }
            // console.log(`${nextLetter} - ${index} - ${searchingForLeaf}`);
            // console.log(branch);
        }

        // console.log('getNode leave while loop');

        return { branch, index, found: searchingForLeaf };
    }

    get(searchString: string): any[] {
        const children: any[] = [];

        const searchedNode = this.getNode(searchString);
        if (!searchedNode.found) return [];

        console.log('flattened branches');
        console.log(searchedNode.branch.branches);

        this.flattenBranches(searchedNode.branch)
            .filter((branch) => branch.children.length > 0)
            .forEach((branch) => children.push(...branch.children));

        return children;
    }

    getClosest(searchString: string): any[] {
        const children: any[] = [];

        const searchedNode = this.getNode(searchString);

        console.log('flattened branches');
        console.log(searchedNode.branch.branches);

        this.flattenBranches(searchedNode.branch)
            .filter((branch) => branch.children.length > 0)
            .forEach((branch) => children.push(...branch.children));

        return children;
    }

    flattenBranches(node: TrieNode): TrieNode[] {
        const branches: TrieNode[] = [];

        Object.values(node.branches).forEach((branch: TrieNode) => {
            branches.push(branch);

            branches.push(...this.flattenBranches(branch));
        });

        return branches;
    }
}

// // console.time('performance');
// const trie: TrieTree = new TrieTree();
// for (let i = 0; i < 1000000; i++) {
//     trie.add(genUID());
// }
// // console.timeEnd('performance');

// // console.log(trie.root);

// console.log('GET');
// // console.time('speed');
// console.log(trie.get('abc'));
// // console.timeEnd('speed');

// // console.log('GET NODE');
// // console.log(trie.getNode('ab'));

// // console.log('abc'.charAt(0));

const trieTree: TrieTree = new TrieTree();
trieTree.add('h 1');
trieTree.add('h 2');
trieTree.add('h 3');

console.log(trieTree.root);
