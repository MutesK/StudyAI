
class Point
{
    x = 0;
    y = 0;

    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
}

class Block
{
    numOfRotate = 4;

    GenerateRandomBlock()
    {
        var list = [];

        var random = Math.floor(Math.random() * 7) + 1;
        this.color = random;

        if(color ===  1 || color === 5 || color === 6)
            this.numOfRotate = 2;
        else if(color === 7)
            this.numOfRotate = 1;
        else 
            this.numOfRotate = 4;

            if (color == 1) {
                var x_idx = [ 0, 0, 0, 0 ];
                var y_idx = [ 4, 5, 6, 7 ];
                this.Make(list, x_idx, y_idx);

            } else if (color == 2) {
                var x_idx = [ 1, 1, 0, 1 ];
                var y_idx = [ 4, 5, 5, 6 ];
                this.Make(list, x_idx, y_idx);

            } else if (color == 3) {
                var x_idx = [ 1, 1, 1, 0 ];
                var y_idx = [ 4, 6, 5, 6 ];
                this.Make(list, x_idx, y_idx);

            } else if (color == 4) {
                var x_idx = [ 0, 1, 1, 1 ];
                var y_idx = [ 4, 4, 5, 6 ];
                this.Make(list, x_idx, y_idx);

            } else if (color == 5) {
                var x_idx = [ 0, 0, 1, 1 ];
                var y_idx = [ 4, 5, 5, 6 ];
                this.Make(list, x_idx, y_idx);

            } else if (color == 6) {
                var x_idx = [ 1, 1, 0, 0 ];
                var y_idx = [ 4, 5, 5, 6 ];
                this.Make(list, x_idx, y_idx);
            } else {
                var x_idx = [ 0, 0, 1, 1 ];
                var y_idx = [ 4, 5, 4, 5 ];
                this.Make(list, x_idx, y_idx);
            }
        
        return list;
    }

    Make(PointList, xIndexs, yIndexs, color)
    {
        for(var index=0; index<4; index++)
        {
            PointList.push(new Point(xIndexs[index], yIndexs[index]));
        }
    }
}