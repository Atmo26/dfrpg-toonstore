/*
 * Angular.js controllers for charsheet components
 */

var app = angular.module('charsheet');

/**********************************************
 * Panel Controllers
 **********************************************/

// handle general panel

app.controller('GeneralCtrl', ['$scope','rootModel', function($scope, rootModel)
{
	$scope.data = rootModel.data;
	$scope.editing = false;
}]);


// handle aspects

app.controller('AspectCtrl', ['$scope','rootModel', function($scope, rootModel)
{
	$scope.data = rootModel.data;
	$scope.editing = false;

	$scope.addAspect = function(){
		console.log('Adding aspect');
		$scope.data.aspects.aspects.push( {name: '', description: ''} );
	};

	$scope.removeAspect = function(index){
		console.log('Removing aspect at ', index);
		$scope.data.aspects.aspects.splice(index,1);
	};
}]);


// skill block and dependencies
//
app.controller('SkillCtrl', ['$scope','rootModel','SharedResources', function($scope, rootModel, SharedResources)
{
	$scope.data = rootModel.data;
	$scope.editing = false;

	$scope.shifted = false;
	$scope.skills = SharedResources.skills;
	$scope.label = SharedResources.skillLabel;

	$scope.$watch('shifted', function(newVal){
		SharedResources.shifted = newVal;
	});

	// correct ordering of skill groups
	$scope.presOrder = function(){
		var arr = [];
		if( ! $scope.data.$resolved )
			return arr;

		for(var i=$scope.data.totals.skill_cap; i>=0; i--){
			arr.push(i);
		}
		return arr;
	};


	// skill ladder validator
	$scope.valid = function(){
		var valid = true;
		if( !$scope.data.$resolved )
			return valid;

		for( var i=1; i<$scope.data.totals.skill_cap; i++ ){
			valid &= SharedResources.skills(i).length >= SharedResources.skills(i+1).length;
		}
		return (valid ? 'Valid' : 'INVALID') + ', '+SharedResources.skillPointsAvailable()+' available';
	};


	// add new skill
	$scope.addSkill = function(skillName)
	{
		$scope.skills(0).push(skillName);
		$scope.skills(0).sort();
	};


	// drag-drop handler
	$scope.dropHandler = function(evt, ui)
	{
		var skill = ui.draggable.find('span').first().text();
		var draggedLevel = angular.element(ui.draggable).parent().scope().level;
		var droppedLevel = angular.element(evt.target).scope().level;
		
		if( draggedLevel != droppedLevel )
		{
			// remove from old group
			var pos = $scope.skills(draggedLevel).indexOf(skill);
			$scope.skills(draggedLevel).splice(pos,1);

			// add to new group (if not removing)
			if( droppedLevel != 0 ){
				$scope.skills(droppedLevel).push(skill);
				$scope.skills(droppedLevel).sort();
			}

			// update ui
			$scope.$apply();

			console.log('Moved skill from', draggedLevel, 'to', droppedLevel);
		}
	};

}]);


// manage miscellaneous fields
//
app.controller('TotalsCtrl', ['$scope','rootModel','SharedResources', function($scope,rootModel,SharedResources)
{
	$scope.data = rootModel.data;
	$scope.editing = false;

	$scope.skillLabel = SharedResources.skillLabel;
	$scope.skillPointsSpent = SharedResources.skillPointsSpent;
	$scope.skillPointsAvailable = SharedResources.skillPointsAvailable;
	$scope.adjustedRefresh = SharedResources.adjustedRefresh;

	$scope.powerLevel = function()
	{
		if( !$scope.data.$resolved ){
			return '';
		}
		else if( $scope.data.totals.base_refresh < 7 ){
			return 'Feet in the Water';
		}
		else if( $scope.data.totals.base_refresh < 8 ){
			return 'Up to Your Waist';
		}
		else if( $scope.data.totals.base_refresh < 10 ){
			return 'Chest-Deep';
		}
		else {
			return 'Submerged';
		}
	};
}]);


// manage the set of stress tracks
//
app.controller('StressCtrl', ['$scope','rootModel', function($scope, rootModel)
{
	$scope.editing = false;
	$scope.data = rootModel.data;

	$scope.addTrack = function(){
		$scope.data.stress.push({
			'name': 'Stress',
			'skill': 'Skill',
			'toughness': 0,
			'strength': 2,
			'boxes': [false,false,null,null,null,null,null,null],
			'armor': []
		});
	};
}]);


// manage a single stress track
//
app.controller('StressTrackCtrl', ['$scope', 'rootModel', function($scope,rootModel)
{
	$scope.data = $scope.$parent.track;
	$scope.index = $scope.$parent.$index;

	// manage strength -> boxes mapping
	$scope.$watch('data.strength', function(newVal, oldVal)
	{
		// maintain length
		while( $scope.data.boxes.length < 8 )
			$scope.data.boxes.push(null);

		for(var i=0; i<8; i++)
		{
			// make legit boxes before strength
			if( i < $scope.data.strength && $scope.data.boxes[i] === null )
				$scope.data.boxes[i] = false;

			// strip out boxes after strength
			else if( i >= $scope.data.strength && $scope.data.boxes[i] !== null )
				$scope.data.boxes[i] = null;
		}
	});
	
	$scope.manageParens = function(boxIndex)
	{
		var classes = [];
		if( $scope.data.toughness != 0 && boxIndex == $scope.data.strength-$scope.data.toughness )
			classes.push('leftParen');
		if( $scope.data.toughness != 0 && boxIndex == $scope.data.strength-1 )
			classes.push('rightParen');
		return classes;
	};

	$scope.addArmor = function(){
		$scope.data.armor.push( {vs:'source', strength:0} );
	};

	$scope.delete = function(){
		rootModel.data.stress.splice($scope.index,1);
	};
}]);
