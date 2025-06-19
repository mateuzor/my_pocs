use dungeon_game::calculate_minimum_hp;

#[test]
fn test_basic_path() {
    let dungeon = vec![
        vec![-2, -3, 3],
        vec![-5, -10, 1],
        vec![10, 30, -5],
    ];
    assert_eq!(calculate_minimum_hp(dungeon), 7);
}

#[test]
fn test_single_zero() {
    let dungeon = vec![vec![0]];
    assert_eq!(calculate_minimum_hp(dungeon), 1);
}

#[test]
fn test_negative_cell() {
    let dungeon = vec![vec![-10]];
    assert_eq!(calculate_minimum_hp(dungeon), 11);
}

#[test]
fn test_all_positive() {
    let dungeon = vec![
        vec![5, 10],
        vec![15, 20],
    ];
    assert_eq!(calculate_minimum_hp(dungeon), 1);
}
