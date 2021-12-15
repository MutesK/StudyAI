
class Gene 
{
    Fitness = 0;
    Score = 0;

    constructor(Number, HoleWeight, ArregateWeight, 
        CompleteLineWeight, BumpinessWeight)
        {
            this.Number = Number;
            this.HoleWeight = HoleWeight;
            this.ArregateWeight = ArregateWeight;
            this.CompleteLineWeight = CompleteLineWeight;
            this.BumpinessWeight = BumpinessWeight;
        }
}

class Calculator
{
    #ud = [-1, 0, 1, 0];
    #rl = [0, 1, 0, -1];

    BlockFitness(BoardScene, Gene)
    {
        var result = 0.0;
        var hw = Gene.HoleWeight, aw = Gene.AggreagteHeight, 
        clw = Gene.CompleteLineWeight, bw = Gene.BumpinessWeight;


        var hc = this.HoleCount(BoardScene);
        var cl = this.CompleteLine(BoardScene);
        
        var height = new Array(BoardScene.Board.length);
        var ah = this.AggreagteHeight(height, BoardScene);
        var b = this.Bumpiness(BoardScene, height);

        result += hc * hw;
        result += cl * clw;
        result += bw * b;
        result += ah * aw;

        return result;
    }

    Bumpiness(BoardScene, height)
    {
        var ret = 0;
        for(let i=1; i<height.length; ++i)
        {
            ret += Math.abs(height[i - 1]- height[i]);
        }
        return ret;
    }

    CompleteLine(BoardScene)
    {
        var ret = 0;

        for(let i = 0; BoardScene.Board.length; ++i)
        {
            var count = 0;
            for(let j =0; BoardScene.Board[0].length; ++j)
            {
                if(BoardScene.Board[i][j] != 0)
                    count++;
            }

            if(count === BoardScene.Board[0].length)
                ret++;
        }

        return ret;
    }

    AggreagteHeight(height, BoardScene)
    {
        for(let i=0; i<BoardScene.Board.length; ++i)
        {
            var startx = 0;

            while(true)
            {
                if(startx >= 20 || BoardScene.Board[startx][i] != 0)
                    break;

                startx++;
            }

            height[i] = startx;
        }

        var ret = 0;
        for(let i =0; i<height.length; ++i)
        {
            ret += height[i];
        }
        return ret;
    }

    HoleCount(BoardScene)
    {
        var visited = new Array(BoardScene.Board.length);
        var ret = 0;
        for(let i = 0; i<BoardScene.Board.length; ++i)
        {
            visited[i] = new Array(BoardScene.Board[0].length);
            for(let j=0; j<BoardScene.Board[0].length; j++)
            {
                visited[i][j] =false;
            }
        }


        for(let i =0; i<BoardScene.Board.length; ++i)
        {
            for(let j=0; j<BoardScene.Board[0].length; ++j)
            {
                if(BoardScene.Board[i][j] != 0)
                    visited[i][j] = true;
            }
        }

        
        this.BFS(0, 4, visited);

        for(let i=0; i<visited.length; ++i)
        {
            for(let j=0; j<visited.length; ++j)
            {
                if(!visited[i][j])
                    ret++;
            }
        }

        return ret;
        
    }

    BFS(startX, startY, visited)
    {
        var queue = [];

        queue.push(new Point(startX, startY));
        visited[startX][startY] = true;

        while(queue.length != 0)
        {
            var elememt = queue.shift();

            for(let i =0; i<4; ++i)
            {
                var nx = elememt.x + this.#ud[i];
                var ny = elememt.y + this.#rl[i];

                if(nx < 0 || nx >= visited.length ||
                    ny < 0 || ny >= visited[0].length ||
                    visited[nx][ny])
                    continue;
                
                visited[nx][ny] = true;
                queue.push(new Point(nx, ny));
            }
        }


    }
}

function GenerateRandom(index) 
{
    var hw = Math.random() - 0.5;
    var aw = Math.random() - 0.5;
    var bw = Math.random() - 0.5;
    var clw = Math.random() - 0.5;

    var Temp = new Gene(index, hw, aw, bw, clw);
    Normalize(Temp);
    return Temp;
}

function Normalize(GeneTemp)
{
    var mean = Math.sqrt(
        GeneTemp.ArregateWeight * GeneTemp.ArregateWeight +
        GeneTemp.BumpinessWeight * GeneTemp.BumpinessWeight +
        GeneTemp.CompleteLineWeight * GeneTemp.CompleteLineWeight +
        GeneTemp.HoleWeight * GeneTemp.HoleWeight
    );

    GeneTemp.ArregateWeight /= mean;
    GeneTemp.HoleWeight /= mean;
    GeneTemp.BumpinessWeight /= mean;
    GeneTemp.CompleteLineWeight /= mean;
}

class Generic
{
    constructor(BoardScene)
    {
        this.Generation = 1;
        this.CurGene = 0;
        this.BoardScene = BoardScene;
        this.Block = new Block();
    }

    Start(WeightSize)
    {
        if(this.Generation === 1)
        {
            console.log("Generation 1");
            var GenerationList = [];

            for(let i=0; i<WeightSize; ++i)
            {
                GenerationList.push(GenerateRandom(i + 1));
                console.log("pushed random gene");
            }

            this.ComputeFitness(GenerationList);
            console.log("compute gene");
            Sort(GenerationList);
            this.Generation++;
        }
        else 
        {
            console.log("Generation Multi");
           var Candidate = new List();
            for(let i=0; i<Math.floor(WeightSize * 0.3); ++i)
            {
                GeneTemp = this.TournamentSelection(GenerationList, Math.floor(WeightSize * 0.1));
                GeneFinal = this.CrossOver(GeneTemp[0], GeneTemp[1]);
                GeneFinal.Number = i + 1;

                // 5% Mutation
                if(Math.random() < 0.05)
                {
                    this.Mutation(GeneFinal);
                }
                this.Normalize(GeneFinal);
                Candidate.append(GeneFinal);
            }

            this.ComputeFitness(Candidate);
            this.DeleteLowFitness(Candidate, GenerationList);

            var TotalFitness = 0;

            for(let i=0; i<GenerationList.length(); i++)
            {
                TotalFitness += GenerationList.get(i).Fitness;
            }

            this.ResetNumber(GenerationList);
            this.Generation++;
        }
        console.log("Generation {}".format(this.Generation));
    }

    ResetNumber(GeneList)
    {
        for(let i=0; i<GeneList.length(); ++i)
        {
            GeneList.get(i).Number = i + 1;
        }
    }

    DeleteLowFitness(CandidateList, ParentList)
    {
        var Parent = new List();

        for(let i=0; i<(ParentList.length() - CandidateList.length())-1; ++i)
        {
            Parent.append(ParentList.get(i));
        }
        ParentList.clear();
        ParentList = Parent;

        for(let i=0; i<CandidateList.length(); ++i)
        {
            Parent.append(CandidateList.get(i));
        }

        Sort(Parent);
    }

    Mutation(Candidate)
    {
        var mutation = Math.random() * 0.5 * 2 - 0.5;
        var index = Math.floor(Math.random() * 4);

        switch(index)
        {
            case 0:
                Candidate.HoleWeight += mutation;
                break;
            case 1:
                Candidate.ArregateWeight += mutation;
                break;
            case 2:
                Candidate.CompleteLineWeight += mutation;
                break;
            case 3:
                Candidate.BumpinessWeight += mutation;
                break;
        }
    }

    CrossOver(Gene1 , Gene2)
    {
        var CrossOverGene = new Gene(
            0,
            Gene1.HoleWeight * Gene1.Fitness + Gene2.HoleWeight * Gene2.Fitness,
            Gene1.ArregateWeight * Gebe1.Fitness + Gene2.ArregateWeight * Gene2.Fitness,
            Gene1.CompleteLineWeight * Gene1.Fitness + Gene2.CompleteLineWeight * Gene2.Fitness,
            Gene1.BumpinessWeight * Gene1.Fitness + Gene2.BumpinessWeight * Gene2.Fitness
        );

        return CrossOverGene;
    }


    TournamentSelection(GenerationList, NumofTournament)
    {
        Gene1 = null, Gene2 = null;
        var SelectGene1 = GenerationList.length();
        var SelectGene2 = GenerationList.length();

        while(true)
        {
            for(let i=0; i<NumofTournament; ++i)
            {
                var selet = Math.floor(Math.random() * GenerationList.length());
                
                if(Gene1 == null || SelectGene1 > select)
                {
                    SelectGene2 = SelectGene1;
                    Gene2 = Gene1;

                    Gene1 = GenerationList.get(select);
                    SelectGene1 = select;
                }
                else if(Gene2 == null || SelectGene2 > select)
                {
                    Gene2 = GenerationList.get(select);
                    SelectGene2 = select;
                }

                console.log("TournamentSelection process {}/{}".format(i, NumofTournament));
            }

            if(Gene1.Fitness != 0 || Gene2.Fitness != 0)
                break;
        }

        return [Gene1, Gene2];
        
    }

    Sort(GeneList)
    {
        GeneList.sort(function(leftGene, rightGene) {
            if(leftGene.Fitness < rightGene.Fitness)
                return -1;
            else if(leftGene.Fitness == rightGene.Fitness)
                return 0;
            else
                return 1;
        });
    }

    ComputeFitness(GenerationList)
    {
        GenerationList.forEach(element => {
            
            this.CurGene = element.Number;

            for(let i=0; i<1; ++i)
            {
                this.BoardScene.Round = i + 1;

                //outter:while(true)
                {
                    var CurBlock = this.Block.GenerateRandomBlock();

                    var GoodPos = [];
                    var bigWeight = Number.MIN_SAFE_INTEGER;
                    this.BoardScene.Time = 2;

                    for(let j=0; j<this.Block.numOfRotate; j++)
                    {
                        /*
                        if(this.BoardScene.IsFinished(CurBlock))
                        {
                            break outter;
                        }
                        */

                        var Ret = this.Move(CurBlock, element);

                        if(bigWeight < Ret[0])
                        {
                            bigWeight = Ret[0];
                            this.CopyList(Ret[1], GoodPos);
                        }

                        this.BoardScene.RotateBlock(CurBlock);
                        this.BoardScene.Time = 0;
                    }

                    this.BoardScene.RenderBlock(GoodPos);
                    this.BoardScene.CalculrateScore();
                    element.Fitness += this.BoardScene.CurrentGameScore;
                }

            }
        });
    }

    Move(Point, Gene)
    {
        var BigWeight = Number.MIN_VALUE;
        var BigWeightList = [];
        var endDown = false, endRight = false;

        var blockList = [];
        this.CopyList(Point, blockList);

        this.BoardScene.MoveBlockLeft(blockList);
        var tempBlock = [];

        while(true)
        {
            this.CopyList(blockList, tempBlock);

            if(endDown = this.BoardScene.MoveBlockDown(tempBlock))
            {
                // render block
                var temp = (new Calculator).BlockFitness(this.BoardScene, Gene);
                if(bigWeight < temp)
                {
                    bigWeight = temp;
                    this.CopyList(tempBlock, BigWeightList);
                }

                // render board
                this.BoardScene.DeleteBlock(tempBlock);
            }

            endRight = this.BoardScene.MoveBlockRight(blockList);

            if(endDown && endRight)
            {
                break;
            }
        }

        var ret = [bigWeight, BigWeightList];
        return ret;
    }

    CopyList(SrcBlockList, DestBlockList)
    {
        DestBlockList = [];

        SrcBlockList.forEach(p => 
            {
                DestBlockList.push(new Point(p.x, p.y));
            });
    }

}