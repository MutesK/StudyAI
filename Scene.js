
class Scene
{
    constructor()
    {
        this.Board = new Array(20);
        for(let i=0; i<this.Board.length; i++)
        {
            this.Board[i] = new Array(10);
        }

        for(let i =0; i<20; ++i)
        {
            for(let j=0; j<10; ++j)
            {
                this.Board[i][j] = 0;
            }
        }
        this.BestLine = 0;
        this.CurrentLine = 0;
        this.Round = 0;
        this.Time = 0;
        this.CurrentGameScore = 0;
    }

    ResetBoard()
    {
        for(let i=0; i<this.Board.length; ++i)
        {
            for(let j=0; this.Board[i].length; ++j)
            {
                this.Board[i][j] = 0;
            }
        }
    }

    IsFinished(BlockPos)
    {
        BlockPos.forEach(block => {
            if(this.Board[block.x][block.y] != 0)
                return true;
        });

        return false;
    }

    DrawBlock(BlockPos)
    {
        BlockPos.forEach(p => {
            this.Board[p.x][p.y] = Block.color;
        });
    }

    RotateBlock(BlockPos)
    {
         var pivot_X = BlockPos.get(1).x;
         var pivot_Y = BlockPos.get(1).y;

         BlockPos.forEach(point => 
            {
               point.x = point.x - pivot_X;
               point.y = point.y - pivot_Y; 
            });
        
        var x_min = 0, x_max = 19, y_min = 0, y_max = 9;
        BlockPos.forEach(point => 
            {
                var nx = point.x * 0 + -1 * point.y;
                var ny = point.y * 1;

                point.x = nx + pivot_X;
                point.y = ny + pivot_Y;

                if(point.x < 0)
                    x_min = Math.min(point.x , x_min);
                
                if(point.x >= 20)
                    x_max = Math.min(point.x, x_max);
                
                if(point.y < 0)
                    y_min = Math.min(point.y , y_min);
                
                if(point.y >= 10)
                    y_max = Math.min(point.y, y_max);
                
            });

        x_min = Math.abs(x_min);
        y_min = Math.abs(y_min);

        BlockPos.forEach(point => 
            {
                point.x += x_min;
                point.y += y_min;
            }
        );

        x_max -= 19;
        y_max -= 9;

        BlockPos.forEach(point => 
            {
                point.x -= x_max;
                point.y -= y_max;
            }
        );

        var min = Number.MAX_SAFE_INTEGER;
        BlockPos.forEach(point => 
            {
                min = Math.min(min, point.x);
            }
        );

        BlockPos.forEach(p =>
            {
                p.x -= min;
            }
        );


    }

    MoveBlockRight(BlockPos)
    {
        var check = false;

        BlockPos.forEach(p => {
            check = false;

            var nx = p.x;
            var ny = p.y;

            if(nx < 0 || nx > this.Board.length ||
                ny < 0 || ny > this.Board[0].length ||
                this.Board[nx][ny] != 0)
                {
                    return;
                }
            check = false;
        });

        if(check)
        {
            BlockPos.forEach(p => {
                p.y += 1;
            });

            this.DrawBlock(BlockPos);
            return false;
        }
        return true;
    }

    MoveBlockLeft(BlockPos)
    {
        var diff = 1;
        while(true)
        {
            var check = false;

            BlockPos.forEach(p =>
                {
                    check = false;
                    var nx = p.x;
                    var ny = p.y - diff;

                    if(nx < 0 || nx > this.Board.length ||
                        ny < 0 || ny > this.Board[0].length ||
                        this.Board[nx][ny] != 0)
                        {
                            return;
                        }
                    
                    check = true;
                });

                if(check)
                    diff++;
                else 
                {
                    diff--;
                    break;
                }
        }

        BlockPos.forEach(p => {
            p.y = diff;
        });
    }

    MoveBlockDown(BlockPos)
    {
        while(true)
        {
            var check = false;

            this.DeleteBlock(BlockPos);
            BlockPos.forEach(p => {
                check = false;
                var nx = p.x + 1;
                var ny = p.y;

                if(nx < 0 || nx > this.Board.length ||
                    ny < 0 || ny > this.Board[0].length ||
                    this.Board[nx][ny] != 0)
                    {
                        return;
                    }

                check = true;
            });

            if(check)
            {
                BlockPos.forEach(p => {
                    p.x += 1;
                });

                this.DrawBlock(BlockPos);
            }
            else 
            {
                return true;
            }
        }
    }

    DeleteBlock(BlockPos)
    {
        BlockPos.forEach(p => {
            this.Board[p.x][p.y] = 0;
        });
    }

    IsCompleteLine()
    {
        var Index = new List();

        for(let i=0; i<this.Board.length; ++i)
        {
            var count = 0;
            for (let j=0; j<this.Board[i].length; ++j)
            {
                if(this.Board[i][j] != 0)
                {
                    count++;
                }
            }

            if(count === this.Board[0].length)
            {
                for(let j =0; j<this.Board[0].length; j++)
                {
                    this.Board[i][j] = 0;
                }

                Index.append(i);
            }
        }

        Index.forEach(i => {
            for(let j=i-1; j>=0; j--)
            {
                for(let k=0; k<this.Board[j].length; ++k)
                {
                    if(this.Board[j][k] != 0)
                    {
                        this.Board[j + 1][k] = this.Board[j][k];
                        this.Board[j][k] = 0;
                    }
                }
            }
        });

        return Index.length();
    }

    CalculrateScore()
    {
        this.CurrentGameScore += this.IsCompleteLine();
        this.BestLine = Math.max(this.BestLine, this.CurrentGameScore);
        this.CurrentLine = this.CurrentGameScore;

        this.Render();
    }

}