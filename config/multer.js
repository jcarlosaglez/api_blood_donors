const multer = require('multer');
const {v4: uuidv4} = require('uuid');

const maxSize = 1 * 1024 * 1024; // 1MB

// Configuración para subir imagenes
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/certified_files');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
    }
});

const multerFilter = (req, file, cb) => {
    if(file.mimetype.split('/')[1] === 'pdf') {
        cb(null, true);
    }
    else {
        cb(new Error('Solo se aceptan archivos de tipo PDF.'), false);
    }
}

const storage = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: {fileSize: maxSize}
});

module.exports = storage;