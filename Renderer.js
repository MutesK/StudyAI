var scene = new Scene();
var generic = new Generic(scene);


function setup()
{
    createCanvas(700, 700);
}

function draw()
{
    var colors = [color(255, 0, 0),
        color(0, 255, 0),
        color(0, 0, 255),
        color(0, 255, 255),
        color(255, 255, 0),
        color(255, 0, 255),
        color(241, 145, 155)];
    
        //generic.Start(1);
    //background(0);
    for(let i=0; i<scene.Board.length; i++)
    {
        for(let j=0; j<scene.Board[0].length; j++)
        {
            if(scene.Board[i][j] != 0)
            {
                console.log(colors[scene.Board[i][j] - 1]);
                stroke(colors[scene.Board[i][j] - 1]);
                rect(j*30, i*30, 30, 30);
            }
        }
    }

    //stroke(255, 255, 255, 0);
    for(let i=1; i<=10; ++i)
    {
        line(i*30, 0, i * 30, 600);
    }

    for(let i=1; i<=20; ++i)
    {
        line(0, i*30, 300, i*30);
    }


/*
    text("Generation : #{}  ()".format(generic.Generation, generic.CurGene), 330, 50);
    text("Best Line : #{}".format(generic.BestLine), 330, 90);
    text("Round : {}R".format(generic.Round), 330, 130);
    text("Current Line : {}".format(generic.CurrentLine), 330, 300);
*/

}