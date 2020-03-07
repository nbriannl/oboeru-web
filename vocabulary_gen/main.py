import random
import time
from os import system, name
from pykakasi import kakasi
from vocabulary import Vocabulary

class Main:
    def main(self):
        self.vocabulary = Vocabulary()
        vocabulary = self.vocabulary
        vocabulary.buildVocabulary()

if __name__ == '__main__':
    main = Main()
    main.main()
