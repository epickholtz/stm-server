
import * as currentYearDao from './current-year-dao.js'

/*gets a staff member and all of its points including the section they are teaching by the members emailID*/
export function getStaff(emailID,db){
	return new Promise((resolve, reject) => {
		currentYearDao.getDashYear(db)
		.then(y => {
		db.query('SELECT `*` FROM `teaches` NATURAL JOIN `staff` WHERE `emailID` = ? AND `year` = ?;', 
			[emailID,y],
             function (err, entities) {
	        if (err) {
	          reject(err)
	        } else {
	          resolve(entities)
	        }
	        })
        })
        .catch(err =>{
        	reject(err)
        })
    })
}

/*gets all staff members and the section they are teaching*/ 
export function getAllStaff(db){
	return new Promise((resolve, reject) => {
		currentYearDao.getDashYear(db)
		.then(y => {
		db.query('SELECT `*` FROM `teaches` NATURAL JOIN `staff` WHERE `year`=?;',y,
             function (err, entities) {
	        if (err) {
	          reject(err)
	        } else {
	          resolve(entities)
	        }
	        })
        })
        .catch(err =>{
        	reject(err)
        })
    })
}

/* creates or updates a staff and all of its columns*/
export function createStaff(data, db){
	return new Promise((resolve, reject) => {
		var data2 = data;
  		var data3 = data2.concat(data);
  		console.log(data3);
		db.query('INSERT INTO `staff` (`emailID`, `access_level`, `firstName`, `lastName`, `gradeTeaching`) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE  `emailID` = ?, `access_level`= ?, `firstName`=?, `lastName`= ?, `gradeTeaching`=?;',
			 data3,
             function (err) {
		        if (err) {
		          reject(err)
		        } else {
		          resolve()
		        }
      })
  })
}


/*deletes staff from the db*/
export function deleteStaff(emailID,db){
	return new Promise((resolve, reject) => {
		db.query('DELETE FROM `staff` WHERE `emailID`= ?', emailID,
			   function (err, entities) {
	        if (err) {
	          reject(err)
	        } else {
	          resolve()
	        }
	        })
	})
}

export function getGrade(emailID, db) {
  return new Promise((resolve, reject) => {
    db.query('select * from staff WHERE emailID = ?;', emailID,
      function (err, entities) {
        if (err) {
          reject(err)
        } else {
          resolve(entities[0].gradeTeaching)
        }
      })
  })
}