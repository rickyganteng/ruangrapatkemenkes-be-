const helper = require('../../helpers')
const userModel = require('./user_model')
const bcrypt = require('bcrypt')
// ssss
module.exports = {
  updateUserProfile: async (req, res) => {
    try {
      const userId = req.decodeToken.user_id
      const userProfileImage = req.decodeToken.user_profile_image
      // console.log('holahol', userId)
      const { firstName, lastName, userPhoneNumber } = req.body
      const setData = {
        user_name: firstName + ' ' + lastName,
        user_phone_number: userPhoneNumber,
        user_profile_image: req.file ? req.file.filename : ''
      }
      // console.log('Data', setData)

      const imgLoc = `src/uploads/${userProfileImage}`
      helper.deleteImage(imgLoc)

      const result = await userModel.updateProfile(setData, userId)
      return helper.response(
        res,
        200,
        'Succes Update Profile (Please get New token) !',
        result
      )
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  getShowTimeById: async (req, res) => {
    try {
      const { id } = req.params
      const result = await userModel.getDataById(id)

      if (result.length > 0) {
        return helper.response(res, 200, `Succes Get Data by Id ${id}`, result)
      } else {
        return helper.response(res, 404, `Data by Id ${id} not Found !`, null)
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  getAllUserTanpaFill: async (req, res) => {
    try {
      const result = await userModel.getDataAllTanpaFill()
      return helper.response(res, 200, 'Succes Get User Data', result)
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  register: async (req, res) => {
    console.log('huhuhu')
    try {
      // console.log(req.body)
      const {
        NamaLengkapPeminjam,
        userName,
        email,
        nohp,
        password,
        userRole,
        userVerif,
        userUnitKerja
      } = req.body

      const salt = bcrypt.genSaltSync(10)
      const encryptPassword = bcrypt.hashSync(password, salt)
      // console.log(`before Encrypt = ${userPassword}`)
      // console.log(`after Encrypt = ${encryptPassword}`)

      const setData = {
        user_name: NamaLengkapPeminjam,
        user_username: userName,
        user_password: encryptPassword,
        user_email: email,
        user_phone_number: nohp,
        user_role: userRole,
        user_verification: userVerif,
        user_unit_kerja: userUnitKerja
      }
      console.log(setData)

      const checkEmailUser = await userModel.getDataCondition({
        user_email: email
      })

      const checkUserName = await userModel.getDataCondition({
        user_username: userName
      })
      console.log('chec email', checkEmailUser)
      console.log('chec username', checkUserName)

      if (checkEmailUser.length === 0) {
        if (checkUserName.length === 0) {
          const result = await userModel.register(setData)
          delete result.user_password

          return helper.response(res, 200, 'Succes register !', result)
        } else {
          return helper.response(res, 400, 'Username has been registered')
        }
      } else {
        return helper.response(res, 400, 'Email has been registered')
      }
    } catch (error) {
      // return helper.response(res, 400, 'Bad Request', error)
      console.log(error)
    }
  },
  updateUser: async (req, res) => {
    try {
      const { id } = req.params
      // kondisi pengecekan apakah data ada dalam database berdasarakan id
      let result = await userModel.getDataById(id)
      console.log('ini result', result[0])
      console.log('ini body', req.body)

      if (result.length > 0) {
        const {
          password,
          NamaLengkapPeminjam,
          userName,
          email,
          nohp,
          userRole,
          userUnitKerja,
          userVerif
        } = req.body
        console.log('req body ya', req.body.NamaLengkapPeminjam)
        console.log('req body ya', req.body.password)
        const salt = bcrypt.genSaltSync(10)
        const encryptPassword = bcrypt.hashSync(password, salt)
        const setData = {
          user_name:
            NamaLengkapPeminjam === ''
              ? result[0].user_name
              : NamaLengkapPeminjam,
          user_username: userName === '' ? result[0].user_username : userName,
          user_email: email === '' ? result[0].user_email : email,
          user_phone_number: nohp === '' ? result[0].user_phone_number : nohp,
          user_password: encryptPassword,
          user_role: userRole === '' ? result[0].user_role : userRole,
          user_verification:
            userVerif === '' ? result[0].user_verification : userVerif,
          user_unit_kerja:
            userUnitKerja === '' ? result[0].user_unit_kerja : userUnitKerja,
          user_updated_at: new Date(Date.now())
        }
        if (req.file) {
          console.log('ada file')
          if (result[0].booking_ruangan_surat_dinas.length > 0) {
            console.log(`Delete Image${result[0].booking_ruangan_surat_dinas}`)
            const imgLoc = `src/uploads/${result[0].booking_ruangan_surat_dinas}`
            helper.deleteImage(imgLoc)
          } else {
            console.log('NO img in DB')
          }
        }
        console.log('UPDATE DATA', req.body)
        console.log(setData)
        // console.log('MOVIE IMAGE DB', result[0].movie_image.length)

        result = await userModel.updateData(setData, id)
        return helper.response(res, 200, 'Succes Update User', result)
      } else {
        return helper.response(
          res,
          404,
          `Cannnot Update !. Data by Id ${id} not Found !`,
          null
        )
      }
    } catch (error) {
      // return helper.response(res, 400, 'Bad Request', error)
      console.log(error)
    }
  },
  deletedUser: async (req, res) => {
    try {
      // console.log(req.params)
      const { id } = req.params
      let result = await userModel.getDataById(id)
      // console.log(result)

      if (result.length > 0) {
        const imgLoc = `src/uploads/${result[0].movie_image}`
        helper.deleteImage(imgLoc)
        result = await userModel.deleteData(id)
        return helper.response(
          res,
          200,
          `Succes Delete Movie With ID ${id}`,
          result
        )
      } else {
        return helper.response(
          res,
          404,
          `Cannot Delete !.s Data by Id ${id} not Found !`,
          null
        )
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  }
}
