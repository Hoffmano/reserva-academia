import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

class generator {
        public static void main(String[] args){
        for (int i = 0; i < 1000; i++) {
            System.out.println(ThreadLocalRandom.current().nextInt(1, 5990 + 1));
        }
    }  
}