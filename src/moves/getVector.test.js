import getVector from './getVector'; // adjust the import to your file structure

describe('getVector', () => {

  it('case 1: NW edge', () => {
    let vector = getVector(0, 0, "NW");

    expect(vector).toEqual(false);

    vector = getVector(0, 0, "NE");

    expect(vector).toEqual(false);

    vector = getVector(0, 0, "E");

    expect(vector.row).toEqual(0);
    expect(vector.col).toEqual(1);

    vector = getVector(0,0, "SE");

    expect(vector.row).toEqual(1);
    expect(vector.col).toEqual(1);

    vector = getVector(0,0, "SW");

    expect(vector.row).toEqual(1);
    expect(vector.col).toEqual(0);

    vector = getVector(0,0,"W");

    expect(vector).toEqual(false);
  });

  it('case 2: NE edge', () => {
    let vector = getVector(0, 5, "NE");

    expect(vector).toEqual(false);

    vector = getVector(0, 5, "E");

    expect(vector).toEqual(false);

    vector = getVector(0, 5, "SE");

    expect(vector.row).toEqual(1);
    expect(vector.col).toEqual(6);

    vector = getVector(0, 5, "SW");

    expect(vector.row).toEqual(1);
    expect(vector.col).toEqual(5);

    vector = getVector(0, 5, "W");

    expect(vector.row).toEqual(0);
    expect(vector.col).toEqual(4);

    vector = getVector(0, 5, "NW");

    expect(vector).toEqual(false);
  });

  it('Case 3: E Edge', () => {
    let vector = getVector(5, 10, "E");

    expect(vector).toEqual(false);
    
    vector = getVector(5, 10, "SE");
    
    expect(vector).toEqual(false);
    
    vector = getVector(5, 10, "SW");
    
    expect(vector.row).toEqual(6);
    expect(vector.col).toEqual(9);
    
    vector = getVector(5, 10, "W");
    
    expect(vector.row).toEqual(5);
    expect(vector.col).toEqual(9);
    
    vector = getVector(5, 10, "NW");
    
    expect(vector.row).toEqual(4);
    expect(vector.col).toEqual(9);
    
    vector = getVector(5, 10, "NE");
    
    expect(vector).toEqual(false);
  });

  it('Case 4: SE Edge', () => {
    let vector = getVector(10, 5, "SE");

    expect(vector).toEqual(false);
    
    vector = getVector(10, 5, "SW");
    
    expect(vector).toEqual(false);
    
    vector = getVector(10, 5, "W");
    
    expect(vector.row).toEqual(10);
    expect(vector.col).toEqual(4);
    
    vector = getVector(10, 5, "NW");
    
    expect(vector.row).toEqual(9);
    expect(vector.col).toEqual(5);
    
    vector = getVector(10, 5, "NE");
    
    expect(vector.row).toEqual(9);
    expect(vector.col).toEqual(6);
    
    vector = getVector(10, 5, "E");
    
    expect(vector).toEqual(false);    
  });

  it('Case 5: SW Edge', () => {
    let vector = getVector(10, 0, "SW");

    expect(vector).toEqual(false);
    
    vector = getVector(10, 0, "W");
    
    expect(vector).toEqual(false);
    
    vector = getVector(10, 0, "NW");
    
    expect(vector.row).toEqual(9);
    expect(vector.col).toEqual(0);
    
    vector = getVector(10, 0, "NE");
    
    expect(vector.row).toEqual(9);
    expect(vector.col).toEqual(1);
    
    vector = getVector(10, 0, "E");
    
    expect(vector.row).toEqual(10);
    expect(vector.col).toEqual(1);
    
    vector = getVector(10, 0, "SE");
    
    expect(vector).toEqual(false);
  });

  it('Case 6: W Edge', () => {
    let vector = getVector(5, 0, "W");

    expect(vector).toEqual(false);
    
    vector = getVector(5, 0, "NW");
    
    expect(vector).toEqual(false);
    
    vector = getVector(5, 0, "NE");
    
    expect(vector.row).toEqual(4);
    expect(vector.col).toEqual(0);
    
    vector = getVector(5, 0, "E");
    
    expect(vector.row).toEqual(5);
    expect(vector.col).toEqual(1);
    
    vector = getVector(5, 0, "SE");
    
    expect(vector.row).toEqual(6);
    expect(vector.col).toEqual(0);
    
    vector = getVector(5, 0, "SW");

    expect(vector).toEqual(false);
  });

  it('Case 7: Center of the board', () => {
    let vector = getVector(5, 5, "W");

    expect(vector.row).toEqual(5);
    expect(vector.col).toEqual(4);
    
    vector = getVector(5, 5, "NW");
    
    expect(vector.row).toEqual(4);
    expect(vector.col).toEqual(4);
    
    vector = getVector(5, 5, "NE");
    
    expect(vector.row).toEqual(4);
    expect(vector.col).toEqual(5);
    
    vector = getVector(5, 5, "E");
    
    expect(vector.row).toEqual(5);
    expect(vector.col).toEqual(6);
    
    vector = getVector(5, 5, "SE");
    
    expect(vector.row).toEqual(6);
    expect(vector.col).toEqual(5);
    
    vector = getVector(5, 5, "SW");
    
    expect(vector.row).toEqual(6);
    expect(vector.col).toEqual(4);
  });

});
