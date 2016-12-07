import * as gradeDao from './grade-dao.js'
import * as currentYearDao from './current-year-dao.js'

export function getPlacement(grade, db) {
  return new Promise((resolve, reject) => {
    gradeDao.getGradeForPlacement(grade, db)
      .then(placement => {
        calculateStats(placement).then(() => {
          resolve(placement)
        })
      })
      .catch(err => {
        reject(err)
      })
  })
}

function calculateStats(placement) {
  return new Promise((resolve, reject) => {
    switch (placement.grade) {
      case 0:
        {
          const reducer = (stats, student) => {
            stats.behavior += student.behaviorObservation
            stats.dial4 += student.dial4
            stats.age += student.age
            if (student.sex === 'F') {
              stats.females++
            } else {
              stats.males++
            }
            if (student.potentialDelay) {
              stats.potentialDelays++
            }
            stats.count++
            return stats
          }

          for (let section of placement.sections) {
            let stats = section.students.reduce(reducer, {
              behavior: 0,
              dial4: 0,
              age: 0,
              females: 0,
              males: 0,
              potentialDelays: 0,
              count: 0
            })
            stats['avgBehavior'] = stats.behavior / stats.count
            stats['avgDial4'] = stats.dial4 / stats.count
            stats['avgAge'] = stats.age / stats.count
            stats['genderRatio'] = stats.males / stats.females
            section.stats = stats
          }
        }
        break
      case 1:
      case 2:
      case 3:
        {
          const reducer = (stats, student) => {
            stats.behavior += student.behaviorScore
            stats.score += student.weightedScore
            if (student.sex === 'F') {
              stats.females++
            } else {
              stats.males++
            }
            if (student.asp) {
              stats.asps++
            }
            if (student.hmp) {
              stats.hmps++
            }
            if (student.advancedMath) {
              stats.advancedMaths++
            }
            if (student.medicalConcern) {
              stats.medicalConcerns++
            }
            if (student.facultyStudent) {
              stats.facultyStudents++
            }
            if (student.newStudent) {
              stats.newStudents++
            }
            stats.count++
            return stats
          }

          for (let section of placement.sections) {
            let stats = section.students.reduce(reducer, {
              asps: 0,
              hmps: 0,
              advancedMaths: 0,
              behavior: 0,
              score: 0,
              females: 0,
              males: 0,
              medicalConcerns: 0,
              facultyStudents: 0,
              newStudents: 0,
              count: 0
            })
            stats['avgBehavior'] = stats.behavior / stats.count
            stats['avgTestScore'] = stats.score / stats.count
            stats['genderRatio'] = stats.males / stats.females
            section.stats = stats
          }
        }
        break
      case 4:
      case 5:
      case 6:
        {
          const reducer = (stats, student) => {
            stats.behavior += student.behaviorScore
            stats.score += student.weightedScore
            if (student.sex === 'F') {
              stats.females++
            } else {
              stats.males++
            }
            if (student.asp) {
              stats.asps++
            }
            if (student.hmp) {
              stats.hmps++
            }
            if (student.advancedMath) {
              stats.advancedMaths++
            }
            if (student.medicalConcern) {
              stats.medicalConcerns++
            }
            if (student.facultyStudent) {
              stats.facultyStudents++
            }
            if (student.newStudent) {
              stats.newStudents++
            }
            stats.count++
            return stats
          }

          for (let section of placement.sections) {
            let stats = section.students.reduce(reducer, {
              asps: 0,
              hmps: 0,
              advancedMaths: 0,
              behavior: 0,
              score: 0,
              females: 0,
              males: 0,
              medicalConcerns: 0,
              facultyStudents: 0,
              newStudents: 0,
              count: 0
            })
            stats['avgBehavior'] = stats.behavior / stats.count
            stats['avgTestScore'] = stats.score / stats.count
            stats['genderRatio'] = stats.males / stats.females
            section.stats = stats
          }
        }
        break
      case 7:
        {
          const reducer = (stats, student) => {
            stats.behavior += student.behaviorScore
            if (student.sex === 'F') {
              stats.females++
            } else {
              stats.males++
            }
            stats.count++
            return stats
          }

          for (let section of placement.sections) {
            let stats = section.students.reduce(reducer, {
              behavior: 0,
              females: 0,
              males: 0,
              count: 0
            })
            stats['avgBehavior'] = stats.behavior / stats.count
            stats['genderRatio'] = stats.males / stats.females
            section.stats = stats
          }
        }
        break
      case 8:
        {
          const reducer = (stats, student) => {
            if (student.sex === 'F') {
              stats.females++
            } else {
              stats.males++
            }
            stats.count++
            return stats
          }

          for (let section of placement.sections) {
            let stats = section.students.reduce(reducer, {
              females: 0,
              males: 0,
              count: 0
            })
            stats['genderRatio'] = stats.males / stats.females
            section.stats = stats
          }
        }
        break
      default:
        reject(new Error(`Invalid placement grade: ${placement.grade}`))
    }
    resolve()
  })
}

function insertSection(selectionInsert, db) {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO `section` (sectionID, year,grade) VALUES ?', 
      [selectionInsert],
      function (err) {
        if (err) {
          console.log("error in insertSection")
          reject(err)
        } else {
          resolve()
        }
      })
  })
}

function insertTeaches(teachesInsert, db) {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO `teaches` (emailID,sectionID, year) VALUES ?', 
      [teachesInsert],
      function (err) {
        if (err) {
          console.log("error in insertTeaches")
          reject(err)
        } else {
          resolve()
        }
      })
  })
}

function insertTakes(takesInsert, db) {
  console.log(takesInsert)
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO `takes` (ID, year,sectionID) VALUES ?', 
      [takesInsert],
      function (err) {
        if (err) {
          console.log('error in insertTakes')
          reject(err)
        } else {
          resolve()
        }
      })
  })
}

export function savePlacement(placement, db) {
  let year = 0
  let sectionNum = 0
  let gradeSection = ''
  let sectionQueries = []
  let teachesQueries = []
  let studentQueries = []


  let sectionPromises = []
  let teachesPromises = []
  let studentPromises = []




  return new Promise((resolve, reject) => {
    calculateStats(placement)
      .then(() => {
        currentYearDao.getDashYear(db)
          .then(result => {
            year = result + 1
            deletePlacement(year, db)
              .then(() => {
                for (let section of placement.sections) {
                  let sectionID = `${placement.grade}${sectionNum.toString()}`
                  sectionNum++
                  let grade = placement.grade
                  let emailID  = section.teacher.emailID
                  sectionQueries.push([sectionID,year,grade],)// gradeSection, placement.grade],)
                  teachesQueries.push([emailID,sectionID,year],)//section.teacher.emailID,gradeSection,year],)
                  for (let student of section.students) {
                    let ID = student.id
                    studentQueries.push([ID,year,sectionID],)
                  }
                 }
                sectionPromises.push(insertSection(sectionQueries,db));
                teachesPromises.push(insertTeaches(teachesQueries,db));
                studentPromises.push(insertTakes(studentQueries,db));

                Promise.all(sectionPromises).then(() => {
                  Promise.all(teachesPromises).then(() => {
                    Promise.all(studentPromises).then(() => {
                      resolve(placement)
                    })
                  })
                })
              })
              .catch(err => {
                reject(err)
              })
          })
          .catch(err => {
            reject(err)
          })
      })
      .catch(err => {
        reject(err)
      })
      }).catch(err => {
        reject(err)
      })
}


export function deletePlacement(year, db) {
  return new Promise((resolve, reject) => {
    deleteSection(year, db)
      .then(() => {
        deleteYDSD(year, db)
          .then(() => {
            deleteTeaches(year, db)
              .then(() => {
                deleteTakes(year, db)
                  .then(() => {
                    resolve()
                  })
                  .catch(err => {
                    reject(err)
                  })
              })
              .catch(err => {
                reject(err)
              })
          })
          .catch(err => {
            reject(err)
          })
      })
      .catch(err => {
        reject(err)
      })
  })
}


function deleteTakes(year, db) {
  return new Promise((resolve, reject) => {
    db.query('SET SQL_SAFE_UPDATES = 0; DELETE from takes where year = ?; SET SQL_SAFE_UPDATES = 1;', year
      , function (err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
  })
}

function deleteTeaches(year, db) {
  return new Promise((resolve, reject) => {
    db.query('SET SQL_SAFE_UPDATES = 0; DELETE from teaches where year = ?; SET SQL_SAFE_UPDATES = 1;', year
      , function (err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
  })
}

function deleteSection(year, db) {
  return new Promise((resolve, reject) => {
    db.query('SET SQL_SAFE_UPDATES = 0; DELETE from section where year = ?; SET SQL_SAFE_UPDATES = 1;', year
      , function (err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
  })
}

function deleteYDSD(year, db) {
  return new Promise((resolve, reject) => {
    db.query('SET SQL_SAFE_UPDATES = 0; DELETE from ydsd where year = ?; SET SQL_SAFE_UPDATES = 1;', year
      , function (err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
  })
}