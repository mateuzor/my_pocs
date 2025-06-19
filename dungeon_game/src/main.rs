use dungeon_game::calculate_minimum_hp;

fn main() {
    let dungeon = vec![
        vec![-2, -3, 3],
        vec![-5, -10, 1],
        vec![10, 30, -5],
    ];

    let result = calculate_minimum_hp(dungeon);
    println!("Minimum required initial life: {}", result);
}
