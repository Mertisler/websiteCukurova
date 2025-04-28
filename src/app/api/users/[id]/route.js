import { executeQuery } from '../../../../lib/db';
import { NextResponse } from 'next/server';

// GET - Tek bir kullanıcının detaylarını getir
export async function GET(request, { params }) {
  try {
    const id = params.id;
    
    const users = await executeQuery({ 
      query: 'SELECT * FROM users WHERE id = ?',
      values: [id]
    });
    
    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ user: users[0] }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: 'Kullanıcı bilgileri alınamadı' }, { status: 500 });
  }
}

// PUT - Kullanıcı bilgilerini güncelle
export async function PUT(request, { params }) {
  try {
    const id = params.id;
    const { name, email } = await request.json();
    
    // Basit doğrulama
    if (!name && !email) {
      return NextResponse.json(
        { error: 'Güncellenecek en az bir alan gereklidir.' }, 
        { status: 400 }
      );
    }
    
    // Kullanıcının var olup olmadığını kontrol et
    const checkUser = await executeQuery({ 
      query: 'SELECT * FROM users WHERE id = ?',
      values: [id]
    });
    
    if (checkUser.length === 0) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' }, 
        { status: 404 }
      );
    }
    
    // Sadece gönderilen alanları güncelle
    let updateQuery = 'UPDATE users SET ';
    const updateValues = [];
    const updateFields = [];
    
    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    
    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    
    updateQuery += updateFields.join(', ') + ' WHERE id = ?';
    updateValues.push(id);
    
    await executeQuery({
      query: updateQuery,
      values: updateValues
    });
    
    return NextResponse.json(
      { message: 'Kullanıcı başarıyla güncellendi' }, 
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ success: false, message: 'Kullanıcı güncellenirken bir hata oluştu' }, { status: 500 });
  }
}

// DELETE - Kullanıcıyı sil
export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    
    // Kullanıcının var olup olmadığını kontrol et
    const checkUser = await executeQuery({ 
      query: 'SELECT * FROM users WHERE id = ?',
      values: [id]
    });
    
    if (checkUser.length === 0) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' }, 
        { status: 404 }
      );
    }
    
    await executeQuery({
      query: 'DELETE FROM users WHERE id = ?',
      values: [id]
    });
    
    return NextResponse.json(
      { message: 'Kullanıcı başarıyla silindi' }, 
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ success: false, message: 'Kullanıcı silinirken bir hata oluştu' }, { status: 500 });
  }
} 