angular
.module('GameApp', [])

.controller("Game",function($scope)
{
	function Grid()
	{
		this.rows = [[0,0,0],[0,0,0],[0,0,0]];
		this.isPickable = function() 
		{ 
			if (this.isFull() || $scope.win) 
			{
				return false;
			}
			else
			{
				return this === $scope.nextGrid || $scope.nextGrid ===  null; 
			}
		}
		this.cellAt = function(coords)
		{ 
			return this.rows[coords[0]][coords[1]]; 
		};
		this.check = function(row,col)
		{
			if (this.rows[row][col] === 0 && this.isPickable())
			{
				this.rows[row][col] = $scope.currentPlayer;
				$scope.nextGrid = $scope.grids[row][col];
				this.testEnd() && this.testEndGame();
				if ($scope.win === null)
				{
					$scope.currentPlayer = $scope.currentPlayer%2+1;
					$scope.message = "Player "+$scope.currentPlayer+"'s turn";
				}
				if ($scope.nextGrid.win === 0 || $scope.nextGrid.isFull()) 
				{
					$scope.nextGrid = null;
				}
			}
		}
		this.isFull = function()
		{
			for (var row=0; row<3; row++)
			{
				for (var col=0;col<3;col++)
				{
					if (this.cellAt([row,col]) === 0) 
					{
						return false;
					}
				}
			}
			return true;
		}
		var winMoves = [
			[ [0,0],[1,0],[2,0]],
			[ [0,1],[1,1],[2,1]],
			[ [0,2],[1,2],[2,2]],
			[ [0,0],[0,1],[0,2]],
			[ [1,0],[1,1],[1,2]],
			[ [2,0],[2,1],[2,2]],
			[ [0,0],[1,1],[2,2]],
			[ [0,2],[1,1],[2,0]]
		];
		
		this.testEnd = function()
		{
			if (this.win != undefined) 
			{
				return true;
			}
			for (var move,m=0; move= winMoves[m]; m++) 
			{
				if (this.cellAt(move[0])>0 && this.cellAt(move[0]) === this.cellAt(move[1]) && this.cellAt(move[1]) === this.cellAt(move[2]))
				{
					this.win = this.cellAt(move[0]);
					this.winMove = m+1;
					return true;
				}
			}
			
			for (var row=0; row<3; row++)
			{
				for (var col=0; col<3; col++)
				{
					if (this.cellAt([row,col]) === 0)
					{
						return false;
					}
				}
			}
			
			this.win = 0;
			return true;
		}

		this.testEndGame = function(){
			for (var move,m=0; move=winMoves[m]; m++) 
			{
				if ($scope.grids[move[0][0]][move[0][1]].win != 0
					&& $scope.grids[move[0][0]][move[0][1]].win != null
					&& $scope.grids[move[0][0]][move[0][1]].win === $scope.grids[move[1][0]][move[1][1]].win 
					&& $scope.grids[move[1][0]][move[1][1]].win === $scope.grids[move[2][0]][move[2][1]].win ) 
				{
					$scope.message = "Player "+$scope.grids[move[0][0]][move[0][1]].win+" wins!";
					$scope.win = 1;
				}
			}
			for (var row=0; row<3; row++)
			{
				for (var col=0;col<3;col++)
				{
					if ($scope.grids[row][col].win === null) 
					{
						$scope.message = "Its a draw!";
						$scope.win=2;
					}
				}
			}
		}
	}
	
	($scope.init=function(){
		$scope.grids= [ [],[],[] ];
		for (var row=0; row<3; row++)
		{
			for (var col=0; col<3; col++)
			{
				$scope.grids[row][col] = new Grid();
			}
		}
		$scope.nextGrid = null;
		$scope.currentPlayer=1;
		$scope.message = "Player "+$scope.currentPlayer+" to start";
		$scope.win = null;
	})();
});